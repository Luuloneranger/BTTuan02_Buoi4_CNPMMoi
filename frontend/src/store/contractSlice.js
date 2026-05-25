// frontend/src/store/contractSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

// Thunk gửi hồ sơ đặt cọc và dịch vụ lên Backend
export const createBookingThunk = createAsyncThunk(
  "contracts/createBooking",
  async (bookingData, thunkAPI) => {
    try {
      const response = await axiosClient.post(
        "/contracts/booking",
        bookingData,
      );
      return response.data; // Trả về { success: true, data: newContract }
    } catch (error) {
      // Trả về thông điệp lỗi chi tiết từ backend phát ra (ví dụ: lỗi chặn ngày < 7 ngày)
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const contractSlice = createSlice({
  name: "contracts",
  initialState: {
    currentContract: null,
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearContractState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.currentContract = action.payload.data;
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearContractState } = contractSlice.actions;
export default contractSlice.reducer;
