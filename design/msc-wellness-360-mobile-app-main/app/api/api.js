import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://192.168.187.133:9085/api/v1.0"


const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers) => {
        const accessToken = await AsyncStorage.getItem('accessTokens')
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`)
        }
        return headers;
    }
})



export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    endpoints: builder => ({})
})