import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchApartmentsThunk } from "../store/apartmentSlice";
import { Link } from "react-router-dom";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

const HomePage = () => {
  const dispatch = useDispatch();
  const { list: apartments, isLoading } = useSelector(
    (state) => state.apartments,
  );

  // Trạng thái lưu trữ các điều kiện lọc dữ liệu
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });

  // Gọi API lấy dữ liệu căn hộ ngay khi vừa mở trang chủ
  useEffect(() => {
    dispatch(fetchApartmentsThunk({}));
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Hàm xử lý kích hoạt bộ lọc khi bấm nút "Tìm kiếm"
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchApartmentsThunk(filters));
  };

  // Phân loại danh sách căn hộ theo các tiêu chí yêu cầu của đề tài
  const promoApartments = apartments.filter(
    (item) => item.isPromoted || item.discountPrice > 0,
  );
  const latestApartments = [...apartments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);
  const bestSellers = [...apartments]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      {/* ─── KHỐI BỘ LỌC TÌM KIẾM ĐA ĐIỀU KIỆN ─── */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-5 rounded-2xl shadow-sm border grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
      >
        <div>
          <InputField
            label="Từ khóa tìm kiếm"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Nhập tên căn hộ..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại căn hộ
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="6645a1b2c3d4e5f6a7b8c901">Studio</option>
            <option value="6645a1b2c3d4e5f6a7b8c902">Căn hộ 1 phòng ngủ</option>
            <option value="6645a1b2c3d4e5f6a7b8c903">Căn hộ 2 phòng ngủ</option>
            <option value="6645a1b2c3d4e5f6a7b8c904">Penthouse</option>
          </select>
        </div>
        <div>
          <InputField
            label="Giá tối thiểu (VNĐ)"
            name="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số phòng ngủ
          </label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Bất kỳ</option>
            <option value="1">1 Phòng ngủ</option>
            <option value="2">2 Phòng ngủ</option>
            <option value="3">3 Phòng ngủ trở lên</option>
          </select>
        </div>
        <div className="mb-4">
          <Button type="submit">Áp dụng lọc</Button>
        </div>
      </form>

      {isLoading && (
        <p className="text-center text-blue-600 font-medium">
          Đang tải danh sách phòng chung cư...
        </p>
      )}

      {/* ─── 1. KHU VỰC KHUYẾN MÃI HOT ─── */}
      <section>
        <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
          🔥 Ưu Đãi Đặc Biệt / Khuyến Mãi
        </h2>
        {promoApartments.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Hiện tại không có căn hộ khuyến mãi nào.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {promoApartments.map((apt) => (
              <ApartmentCard key={apt._id} data={apt} />
            ))}
          </div>
        )}
      </section>

      {/* ─── 2. KHU VỰC CĂN HỘ MỚI NHẤT ─── */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          ✨ Căn Hộ Mới Nhất
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {latestApartments.map((apt) => (
            <ApartmentCard key={apt._id} data={apt} />
          ))}
        </div>
      </section>

      {/* ─── 3. KHU VỰC ĐẶT CỌC BÁN CHẠY NHẤT ─── */}
      <section>
        <h2 className="text-xl font-bold text-amber-600 mb-4">
          🏆 Căn Hộ Bán Chại / Được Cọc Nhiều Nhất
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {bestSellers.map((apt) => (
            <ApartmentCard key={apt._id} data={apt} />
          ))}
        </div>
      </section>
    </div>
  );
};

// Component thẻ căn hộ dùng chung trong trang chủ
const ApartmentCard = ({ data }) => {
  return (
    <Link
      to={`/apartments/${data._id}`}
      className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
    >
      <div>
        <img
          src={data.images?.[0] || "https://via.placeholder.com/400x250"}
          alt={data.title}
          className="w-full h-44 object-cover"
        />
        <div className="p-4 space-y-1">
          <span className="text-xs font-bold text-blue-600 uppercase">
            {data.category}
          </span>
          <h3 className="font-semibold text-gray-800 text-base truncate">
            {data.title}
          </h3>
          <p className="text-sm font-bold text-blue-600">
            {data.price?.toLocaleString()} VNĐ
          </p>
        </div>
      </div>
      <div className="p-4 pt-0 border-t border-gray-100 flex justify-between text-xs text-gray-500 mt-2">
        <span>
          Còn trống: <b>{data.inventory}</b>
        </span>
        <span>
          Đã cọc: <b>{data.soldCount}</b>
        </span>
      </div>
    </Link>
  );
};

export default HomePage;
