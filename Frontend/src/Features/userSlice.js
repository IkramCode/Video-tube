import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", credentials);
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      s;
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/register", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
