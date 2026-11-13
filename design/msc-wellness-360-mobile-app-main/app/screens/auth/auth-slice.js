import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: null,
        email: null,
        loading: false
    },

    reducers: {
        authenticate: (state, action) => {
            const {  accessToken, email } = action.payload;
            state.accessToken = accessToken;
            state.email = email;
            state.loading = false;
        },

        startAuthentication: (state) => {
            state.loading = true
        },
        logout: (state) => {
            state.accessToken = null;
            state.email = null;
        }
    }
})


export const { authenticate, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.accessToken;