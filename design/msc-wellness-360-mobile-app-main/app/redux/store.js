import { authenticationApi } from "../screens/auth/auth-api-slice";
import authReducer from "../screens/auth/auth-slice"
import { configureStore } from "@reduxjs/toolkit";
import { appointmentApi } from "../screens/appointment/appointment-slice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        [authenticationApi.reducerPath]: authenticationApi.reducer,
        [appointmentApi.reducerPath]: appointmentApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authenticationApi.middleware),
})


export default store;