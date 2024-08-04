import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: "",
    password : "",
}

export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        enterEmail: (state, action) => {
            state.email = action.payload;
        },
        enterPassword: (state, action) => {
            state.password = action.payload;
        },
    },
});

export const { enterEmail, enterPassword } = loginSlice.actions;
export default loginSlice.reducer;