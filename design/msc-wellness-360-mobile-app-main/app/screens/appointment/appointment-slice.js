import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "../../api/api";


export const appointmentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPatientAppointments: builder.query({
            query: () => ({
                url: "/appointment/patient/all",
                transformResponse: res => res.response
            })
        }),
        getAllPatientStaffs: builder.query({
            query: () => ({
                url: "/auth/patient/staffs",
                transformResponse: res => res.response
            })
        }),
        createPatientAppointment: builder.mutation({
            query: (data) => ({
                method: "POST",
                url: "/appointment",
                body: {
                    staff_id: data.staff_id,
                    requested_date: data.requested_date,
                    reason: data.reason
                }
            })
        })
    })
})



export const {
    useGetAllPatientAppointmentsQuery,
    useGetAllPatientStaffsQuery,
    useCreatePatientAppointmentMutation

} = appointmentApi;