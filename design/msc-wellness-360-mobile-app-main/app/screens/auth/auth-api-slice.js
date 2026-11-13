import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "../../api/api";

const staffId = AsyncStorage.getItem("staff_id");

export const authenticationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signIntoPatientAccount: builder.mutation({
            query: (data) => ({
                url: "/auth/patient/signin",
                method: "POST",
                body: {
                    email: data.email,
                    password: data.password,
                    role: "patient"
                }
            })
        }),
        verifyOTP: builder.mutation({
            query: (data) => ({
                url: "/otp/verification",
                method: "POST",
                body: {
                    email: data.email,
                    secret: data.secret,
                    role: "patient"
                }
            })
        }),
        sendPatientOTP: builder.mutation(({
            query: (data) => ({
                url: "/otp",
                method: "POST",
                body: {
                    email: data.email,
                    role: data.role
                }
            })
        })),
        changePatientPassword: builder.mutation({
            query: (data) => ({
                url: "/auth/patient/change-password",
                method: "PUT",
                body: {
                    email: data.email,
                    role: data.role,
                    password: data.password
                }

            })
        })
    }),
});


export const {
    useSignIntoPatientAccountMutation,
    useSendPatientOTPMutation,
    useChangePatientPasswordMutation,
    useVerifyOTPMutation

} = authenticationApi;