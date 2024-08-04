import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  avatar: null,
  coverImage: null,
};

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    addFullName: (state, action) => {
      state.fullName = action.payload;
    },
    addUsername: (state, action) => {
      state.username = action.payload;
    },
    addEmail: (state, action) => {
      state.email = action.payload;
    },
    addPassword: (state, action) => {
      state.password = action.payload;
    },
    addAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    addCoverImage: (state, action) => {
      state.coverImage = action.payload;
    },
  },
});

export const {
  addFullName,
  addUsername,
  addEmail,
  addPassword,
  addAvatar,
  addCoverImage,
} = registerSlice.actions;
export default registerSlice.reducer;
