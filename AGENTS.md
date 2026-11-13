# Danjenni — Agent Instructions

**Danjenni** (shown to users as **D&J Logistics**) is a Ghana-based logistics customer portal: shipment tracking, invoices, and online payment. Customers **sign up themselves** (email + password, or Google / Apple) and then log in; every customer screen — shipments, invoices, payments — requires a signed-in user. Customers belong to organizations (their company); staff and admins use the same apps.

- Progress and phase plan: [PLAN.md](PLAN.md) — the source of truth for what to build next. Tick `- [x]` only when a task is done **and** lint + typecheck pass.
- UI reference mockups and design system: [design/](design/).

This is an Expo/React Native mobile app (a Next.js web app + API joins it in a monorepo per PLAN.md Phase 0). Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Hard rules

- **Never run the app yourself.** The user runs the dev server separately in their terminal. Do not run `expo start`, `expo run:*`, `npm start`, `npm run ios|android|web`, `next dev`, the Inngest dev server, or any other long-running dev process. If you need to see behavior, ask the user to check it.
- **Mobile navigation always uses native tabs.** Use `NativeTabs` from `expo-router/native-tabs`. Never use JavaScript tabs (`Tabs` from `expo-router`, `@react-navigation/bottom-tabs`, or custom JS tab bars). `expo-router/unstable-native-tabs` is deprecated — don't use it.
- **Don't swap the stack.** Use the services and libraries listed below. Ask before adding any new dependency.
- **Local-only phase.** No deployments, no EAS builds/submits/updates, no CI/hosting setup until the user decides.
- **Don't commit** unless asked.

## Tech stack (fixed)

| Area | Choice |
| --- | --- |
| Mobile | Expo SDK 58, React Native 0.88, React 19.3, TypeScript (strict) |
| Routing | Expo Router (typed routes), native tabs |
| Styling | NativeWind 4 + Tailwind CSS 3 (`className`) |
| Web + API | Next.js (App Router) — planned, in the monorepo |
| Database | Postgres on **Neon** |
| ORM | **Drizzle** (`drizzle-kit` for migrations) |
| Auth | **Clerk** (Organizations for customer companies; `admin`/`staff` roles) |
| Background jobs | **Inngest** (dev server locally) |
| Images & files | **ImageKit** (image optimization/transforms; private documents via signed URLs) |
| Errors & monitoring | **Sentry** |
| Payments | Paystack (Ghana) |
| SMS | mNotify |
| Email | Resend |
| Shared validation | zod (in `packages/shared`) |
| Local key-value storage | `expo-sqlite/kv-store` (e.g. saved theme); `localStorage` in `.web.ts` files |
| Theme | Light/dark via NativeWind `colorScheme`; `useAppTheme()` toggles + saves, `useThemeColor()` for native color props |

Clerk skills live in `.claude/skills/` — use them (e.g. `clerk-expo`, `clerk-orgs`, `clerk-webhooks`) before writing Clerk code.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. Before writing code that touches an Expo, EAS, or React Native API:

1. The project is on **Expo SDK 58** (check `expo` in `package.json` if unsure).
2. Use the versioned docs: https://docs.expo.dev/versions/v58.0.0/
3. For anything else, start at https://docs.expo.dev/llms.txt and follow its links. Never answer from memory.

The same applies to Clerk, Drizzle, Inngest, Sentry, and ImageKit SDKs — check current docs before using an API.

## Commands

```bash
npx expo install <package>  # ALWAYS use for mobile packages — resolves SDK-compatible versions
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done. (Do not start the dev server — see Hard rules.)

## Mobile app conventions

**Navigation**
- Routes live in `src/app/`; every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code in `src/components`, `src/hooks`, `src/lib`.
- Import `Link`, `router`, `useLocalSearchParams` from `expo-router`. Typed routes are on — use typed hrefs.
- Tab layouts use `NativeTabs` / `NativeTabs.Trigger`; use SF Symbols (iOS) and Material icons (Android) for tab icons.

**UI**
- Prefer native components: `expo-symbols`, `expo-glass-effect`, `@expo/ui`, `expo-image` (never RN `<Image>`).
- Style with NativeWind `className`; use `StyleSheet`/`style` only where a native component requires it.
- Colors, fonts, radii, and spacing come from tokens in `tailwind.config.js` (derived from `design/dj-logistics-design-system.jpg`). Don't hard-code hex values in components.
- Support light and dark mode.
- Match the mockups in `design/` when building those screens.

**Code**
- React Compiler is enabled — don't add `useMemo`/`useCallback`/`memo` by hand unless profiling shows a need.
- Import from `src/` via the `@/` alias.
- `EXPO_PUBLIC_*` env vars are bundled into the app — never put secrets there (`CLERK_SECRET_KEY`, `DATABASE_URL`, ImageKit private key, etc. stay server-side).
- The mobile app never talks to Neon directly; it calls the API with a Clerk session token.

## Backend conventions

- **Drizzle:** schema in `packages/db`; change the schema, then `drizzle-kit generate` + `migrate`. Never edit generated migrations by hand or alter the DB outside migrations.
- **Authorization:** every customer query is scoped by `org_id`. Staff/admin actions go through `requireStaff` / `requireAdmin` guards.
- **Inngest:** slow or retryable work (SMS, email, Clerk webhook sync, payment reconciliation) runs in Inngest functions, not in request handlers. Functions must be idempotent.
- **ImageKit:** shipment photos may be public; customer documents and invoices are private and served only via short-lived signed URLs.
- **Sentry:** keep `sendDefaultPii: false` and masked replays. Never log invoice contents, documents, tokens, or phone numbers.

## Domain rules

- Auth flow: public sign-up is open. A new customer signs up → verifies email → creates their company organization (or accepts a teammate's invite) → sees their org's shipments/invoices. Staff link shipments and invoices to a customer org; customers never see data outside their org.
- Staff/admin accounts are never self-assigned: the `admin`/`staff` role is set only by an admin (Clerk `publicMetadata`), never from sign-up input.
- Money is stored as integer minor units (cents/pesewas). Invoices are in USD; payments are charged in GHS at an FX rate locked on the invoice.
- Tracking is staff-updated only (no GPS or carrier APIs). Status flow: Received → In transit → At port → Customs → Out for delivery → Delivered (+ Exception / On hold).
- Phone numbers use Ghana E.164 format (`+233…`).
- Unique keys: tracking number, invoice number, Paystack reference, Clerk IDs.

## Native config

- `ios/` and `android/` are generated (Continuous Native Generation). Never create or edit them — configure native behavior in `app.json` and config plugins.
- Expo Go only includes bundled native modules; this project uses a development build (`expo-dev-client`). If you add a library with native code, tell the user a new dev build is needed — don't build it yourself.
