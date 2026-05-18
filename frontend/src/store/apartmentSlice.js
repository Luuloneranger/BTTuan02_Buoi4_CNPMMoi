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
export const fetchByCategoryLazyThunk = createAsyncThunk(
  "apartments/fetchByCategoryLazy",
  async ({ categoryId, page, limit }, thunkAPI) => {
    try {
      const response = await axiosClient.get(
        `/apartments/category/${categoryId}?page=${page}&limit=${limit}`,
      );
      return response.data; // Trả về { apartments, hasMore }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
export const fetchTopFeaturesThunk = createAsyncThunk(
  "apartments/fetchTop",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get("/apartments/top-features");
      return response.data; // Trả về { bestSellers, mostViewed }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const apartmentSlice = createSlice({
  name: "apartments",
  initialState: {
    list: [],
    lazyList: [],
    isLoading: false,
    hasMore: true,
    topFeatures: { bestSellers: [], mostViewed: [] },
  },
  reducers: {
    clearLazyList: (state) => {
      state.lazyList = [];
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApartmentsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchApartmentsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchByCategoryLazyThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchByCategoryLazyThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Kỹ thuật gộp mảng: Giữ nguyên các phòng cũ đã load, nối thêm phòng của trang mới vào đuôi
        state.lazyList = [...state.lazyList, ...action.payload.apartments];
        state.hasMore = action.payload.hasMore;
      })
      // Xử lý Top 10
      .addCase(fetchTopFeaturesThunk.fulfilled, (state, action) => {
        state.bestSellers = action.payload.bestSellers;
        state.mostViewed = action.payload.mostViewed;
      });
  },
});

export default apartmentSlice.reducer;
