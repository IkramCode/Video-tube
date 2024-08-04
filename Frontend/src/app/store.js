import { configureStore } from "@reduxjs/toolkit";

import registerSlice from "../Features/registerSlice";
import loginSlice from "../Features/loginSlice";

export const store = configureStore({
  reducer: {
    register: registerSlice.reducer,
    login: loginSlice.reducer,
  },
});
