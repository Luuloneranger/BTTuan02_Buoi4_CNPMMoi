// frontend/src/store/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

// 1. Thunk: Lấy danh sách căn hộ quan tâm từ DB về
export const fetchCartThunk = createAsyncThunk(
  "cart/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get("/cart");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async ({ apartmentId }, thunkAPI) => {
    try {
      const response = await axiosClient.post("/cart/add", { apartmentId });
      console.log("Thêm vào giỏ hàng thành công:", response.data);
      await thunkAPI.dispatch(fetchCartThunk());

      return response.data.data;
    } catch (error) {
      console.log("❌ LỖI CHI TIẾT TỪ SERVER TRẢ VỀ:", error.response?.data);
      console.error("Lỗi thêm vào giỏ hàng:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý lấy giỏ hàng
      .addCase(fetchCartThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      // Xử lý thêm vào giỏ hàng
      .addCase(addToCartThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCartThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
