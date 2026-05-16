import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

// Hàm gửi mã OTP về Email
export const sendOTPThunk = createAsyncThunk(
  "auth/sendOTP",
  async (email, thunkAPI) => {
    try {
      const response = await axiosClient.post("/auth/send-otp", { email });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Không gửi được OTP",
      );
    }
  },
);

// Hàm Đăng ký tài khoản kèm OTP
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axiosClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Đăng ký thất bại",
      );
    }
  },
);

// Hàm Đăng nhập
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosClient.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token); // Lưu token lại khi thành công
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, isLoading: false, error: null, otpSent: false },
  reducers: {
    logoutAction: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(sendOTPThunk.fulfilled, (state) => {
        state.otpSent = true;
      })
      .addCase(sendOTPThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logoutAction } = authSlice.actions;
export default authSlice.reducer;
