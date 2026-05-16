import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

// Hàm lấy phòng có truyền kèm theo các điều kiện lọc (Giá, Số phòng, Từ khóa)
export const fetchApartmentsThunk = createAsyncThunk(
  "apartments/fetchAll",
  async (filters, thunkAPI) => {
    try {
      const response = await axiosClient.get("/apartments", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Lỗi không tải được danh sách phòng");
    }
  },
);

const apartmentSlice = createSlice({
  name: "apartments",
  initialState: { list: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApartmentsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchApartmentsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      });
  },
});

export default apartmentSlice.reducer;
