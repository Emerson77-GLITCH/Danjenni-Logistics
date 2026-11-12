# Danjenni — v1 Implementation Plan

Tick a box (`- [x]`) when a task is done. A phase is complete when every box in it is ticked.
Full spec (decisions, data model, assumptions, risks): see the "Spec snapshot" at the bottom.

**Rules for every phase**
- Check the versioned docs before touching any Expo/RN API (Expo SDK 58 → https://docs.expo.dev/versions/v58.0.0/). Install mobile packages with `npx expo install`.
- Before ticking a box: `npx expo lint` + `npx tsc --noEmit` pass.
- Local-only for now: no deployments. Background jobs run on the **Inngest dev server**.

---

## Phase 0 — Monorepo & local dev setup
- [ ] Convert repo to npm workspaces + Turborepo (`apps/*`, `packages/*`)
- [ ] Move the existing Expo app into `apps/mobile` (keep Expo Router in `src/app/`)
- [ ] Create `apps/web` (Next.js, App Router, TypeScript)
- [ ] Create `packages/shared` (zod schemas, shared types, money/FX helpers)
- [ ] Create `packages/db` (Drizzle schema + Neon client)
- [ ] Shared TS config, ESLint, Prettier across workspaces
- [ ] `.env.example` for each app (Clerk, Neon, Inngest, ImageKit, Paystack, mNotify, Resend, Sentry)
- [ ] Root scripts: `dev` (web + mobile + Inngest dev server), `lint`, `typecheck`
- [ ] Inngest client + `/api/inngest` route in `apps/web`; Inngest dev server connects and shows a hello-world function
- [ ] README: how to run everything locally

## Phase 1 — Database (Neon + Drizzle)
- [ ] Create Neon project + `dev` branch; connection string in `.env`
- [ ] Schema: `organizations`, `users`
- [ ] Schema: `shipments`, `shipment_events`
- [ ] Schema: `files`
- [ ] Schema: `invoices`, `invoice_items`
- [ ] Schema: `payments`, `fx_rates`
- [ ] Schema: `notification_log`, `audit_log`
- [ ] Unique constraints (tracking_number, invoice_number, paystack_reference, clerk ids) and indexes on `org_id`
- [ ] Money stored as integer minor units (pesewas/cents); helpers in `packages/shared`
- [ ] Migrations workflow (`drizzle-kit generate` / `migrate`) + seed script with sample org, shipments and invoices

## Phase 2 — Authentication & roles (Clerk)
- [ ] Clerk app set up with Organizations enabled; public sign-up disabled (invite-only)
- [ ] Clerk in `apps/web` (middleware, sign-in page, protected routes)
- [ ] Clerk in `apps/mobile` (verify the Expo SDK 58–compatible package and setup in the docs first; secure token storage)
- [ ] Roles: `admin` / `staff` stored in `publicMetadata.role`; customers = org members
- [ ] Clerk webhook → Inngest: sync users and orgs into Neon (idempotent)
- [ ] API auth helper: verify Clerk session token (web cookie + mobile bearer), resolve `{ userId, role, orgId }`
- [ ] Authorization guards: `requireStaff`, `requireAdmin`, `requireOrgMember` (every customer query scoped by `org_id`)
- [ ] Tests: customer of org A cannot read org B's data

## Phase 3 — Admin: customers & invites (web)
- [ ] `/admin` layout, role-gated to staff/admin
- [ ] Create customer organization (name, phone, billing email)
- [ ] Invite customer users to an org (Clerk invitation email)
- [ ] List orgs and members; remove a member
- [ ] Admin-only: manage staff accounts and roles
- [ ] Audit-log entries for these actions

## Phase 4 — Shipments & tracking
- [ ] API: create/update shipment (staff), list/get shipments (scoped by org for customers)
- [ ] API: post status event (staff) → updates `current_status` → emits `shipment/status.changed`
- [ ] Status flow: Received → In transit → At port → Customs → Out for delivery → Delivered (+ Exception/On hold)
- [ ] Admin web: shipment list (search by tracking no./org, filter by status), create/edit form, event timeline + add event
- [ ] Customer web: shipments list + detail with timeline
- [ ] Customer mobile: shipments list + detail with timeline, pull-to-refresh
- [ ] Empty states ("No shipments yet"), loading and error states

## Phase 5 — Files & images (ImageKit)
- [ ] API: ImageKit upload-signature endpoint (auth-checked)
- [ ] Public folder for cargo/proof-of-delivery photos and branding; private folder for customer documents
- [ ] API: signed, short-lived URLs for private documents (org-scoped)
- [ ] Record uploads in the `files` table, linked to shipment/event/org
- [ ] Web: upload photos on shipment events (admin); customers upload/view documents
- [ ] Mobile: show photos with ImageKit transforms (thumbnails/resized) via `expo-image`
- [ ] Org logo / user avatar upload

## Phase 6 — Invoices
- [ ] API: create draft invoice with line items (GHS or USD), compute subtotal/tax/total
- [ ] Sequential invoice numbers (unique, e.g. `DJ-2026-0001`)
- [ ] Issue invoice (draft → issued) → emits `invoice/issued`; void invoice (admin)
- [ ] Inngest: generate invoice PDF → upload to ImageKit (private) → save `pdf_file_id`
- [ ] Admin web: invoice list/filter, create/edit draft, issue, void
- [ ] Customer web + mobile: invoice list (Unpaid/Paid/Overdue), detail, download PDF
- [ ] Tests: invoice totals and rounding

## Phase 7 — Payments (Paystack Ghana + FX)
- [ ] Paystack test-mode account + keys in `.env`
- [ ] Admin: set the daily USD→GHS exchange rate (`fx_rates`)
- [ ] API: start payment → lock exchange rate for 30 min → create Paystack transaction (GHS) → return checkout URL
- [ ] "You will be charged GHS X at rate Y" confirmation UI before paying
- [ ] Web: redirect to Paystack checkout + return/callback page
- [ ] Mobile: open checkout with `expo-web-browser`, deep link back to the app, refresh invoice state
- [ ] Webhook endpoint: verify Paystack signature → send Inngest event `paystack/charge.success`
- [ ] Inngest: idempotent on `paystack_reference` → mark payment + invoice paid → generate receipt PDF
- [ ] Local webhook testing via a tunnel (ngrok/cloudflared)
- [ ] Tests: replaying a webhook does not double-apply; amount mismatch is rejected; test card + MoMo flows end to end

## Phase 8 — Notifications (mNotify SMS + Resend email)
- [ ] mNotify client in `packages/shared` or `apps/web` (API key, sender ID registered)
- [ ] Resend client + React Email templates (status update, invoice issued, payment receipt)
- [ ] Inngest: `shipment/status.changed` → SMS + email to org members
- [ ] Inngest: `invoice/issued` → email (with PDF link) + SMS
- [ ] Inngest: payment success → receipt email + SMS
- [ ] Log every send in `notification_log`; failures retried but never block shipments or payments
- [ ] Phone numbers validated/stored in E.164 (+233…)

## Phase 9 — Staff features on mobile
- [ ] Role-gated staff screens in the same Expo app
- [ ] Staff: find shipment (search / tracking no.), post status event
- [ ] Staff: take/upload proof-of-delivery and cargo photos (camera + gallery permissions in `app.json`)
- [ ] Retry for failed uploads on slow networks
- [ ] Development build for camera testing (`npx expo run:android|ios`)

## Phase 10 — Scheduled jobs (Inngest cron)
- [ ] Overdue invoice reminders (email + SMS)
- [ ] Reconcile stuck pending payments via Paystack verify API
- [ ] Expire stale exchange-rate locks / abandoned payment attempts

## Phase 11 — Monitoring (Sentry)
- [ ] `@sentry/nextjs` in `apps/web` (API errors, traces)
- [ ] `@sentry/react-native` in `apps/mobile` (check the SDK 58 setup in the docs)
- [ ] Report Inngest function failures to Sentry
- [ ] Attach user/org context to events (no sensitive personal data in payloads)

## Phase 12 — Hardening & QA
- [ ] Org-isolation tests for every customer endpoint
- [ ] Input validation with zod on every API route
- [ ] Rate limiting on payment start and upload-signature endpoints
- [ ] Accessibility pass (labels, contrast, dynamic text) on mobile + web
- [ ] Slow-network / offline error states on mobile
- [ ] Full end-to-end walkthrough: invite → shipment → events → invoice → pay → receipt → notifications

## Phase 13 — Deployment & CI (deferred — decide later)
- [ ] Choose hosting for `apps/web` + Inngest Cloud
- [ ] Staging + production Neon branches
- [ ] EAS Build / Update for mobile
- [ ] CI: lint, typecheck, tests on PRs
- [ ] Paystack live keys + production webhook

---

## Spec snapshot

**Stack (fixed):** Clerk · Inngest (dev server for now) · Expo SDK 58 (mobile) · Next.js (web + API + admin) · Neon Postgres + Drizzle · ImageKit · Sentry · Paystack Ghana · mNotify (SMS) · Resend (email)

**Users:** business customers (Clerk Organizations, invite-only); internal `admin` and `staff`.

**Out of scope for v1:** live GPS/driver tracking, carrier API integrations, customer self-booking, push notifications, partial payments, ERP sync, public no-login tracking, i18n.

**Assumptions:** Drizzle + Turborepo; admin sets the USD→GHS rate by hand; full payments only, refunds done in the Paystack dashboard; staff use the same mobile app; English only.

**Open risks:** Paystack merchant approval time; mNotify sender ID registration; storing private customer documents under Ghana's Data Protection Act; exchange-rate disputes; testing/deploy bar still to be decided.
