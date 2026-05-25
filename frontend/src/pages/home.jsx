import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchApartmentsThunk } from "../store/apartmentSlice";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { addToCartThunk } from "../store/cartSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const { list: apartments, isLoading } = useSelector(
    (state) => state.apartments,
  );

  // Khai báo các biến neo (Ref) để điều khiển thanh cuộn ngang bằng nút bấm
  const bestSellersRef = useRef(null);
  const mostViewedRef = useRef(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });

  useEffect(() => {
    dispatch(fetchApartmentsThunk({}));
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchApartmentsThunk(filters));
  };

  // Logic nhấn nút dịch chuyển thanh cuộn sang Trái hoặc sang Phải (Phân trang ngang)
  const handleScrollHorizontal = (elementRef, direction) => {
    if (elementRef.current) {
      const scrollAmount = 320; // Khoảng cách dịch chuyển mỗi lần bấm nút (px)
      elementRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  // Phân loại danh sách dữ liệu từ 10 căn mẫu đã nạp
  const promoApartments = apartments.filter(
    (item) => item.isPromoted || item.discountPrice > 0,
  );
  // Sắp xếp theo bán chạy (soldCount) để lấy Top 10
  const bestSellers = [...apartments]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 10);
  // Sắp xếp theo lượt xem (viewsCount) để lấy Top 10
  const mostViewed = [...apartments]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      {/* ─── 1. KHỐI BỘ LỌC TÌM KIẾM ĐA ĐIỀU KIỆN ─── */}
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
            <option value="">Tất cả loại phòng</option>
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

      {/* ─── 2. KHU VỰC KHUYẾN MÃI HOT (HIỂN THỊ DẠNG LƯỚI GRID) ─── */}
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
              <ApartmentCard key={apt._id} data={apt} isSlider={false} />
            ))}
          </div>
        )}
      </section>

      {/* ─── 3. KHU VỰC TOP 10 BÁN CHẠY (TRƯỢT NGANG NÂNG CAO) ─── */}
      <section className="relative group">
        <h2 className="text-xl font-bold text-amber-600 mb-4">
          🏆 Top 10 Căn Hộ Bán Chạy / Được Cọc Nhiều Nhất
        </h2>

        {/* Nút bấm dịch sang trái */}
        <button
          type="button"
          onClick={() => handleScrollHorizontal(bestSellersRef, "left")}
          className="absolute left-[-15px] top-[55%] -translate-y-1/2 bg-white/90 border border-gray-200 text-gray-700 w-10 h-10 rounded-full shadow-md z-10 hidden group-hover:flex items-center justify-center font-bold text-lg hover:bg-gray-100 transition-all"
        >
          ❮
        </button>

        {/* Vùng cuộn ngang chứa danh sách */}
        <div
          ref={bestSellersRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Ẩn thanh scrollbar xấu trên Firefox/IE
        >
          {bestSellers.map((apt) => (
            <ApartmentCard
              key={apt._id}
              data={apt}
              isSlider={true}
              showBadge="sold"
            />
          ))}
        </div>

        {/* Nút bấm dịch sang phải */}
        <button
          type="button"
          onClick={() => handleScrollHorizontal(bestSellersRef, "right")}
          className="absolute right-[-15px] top-[55%] -translate-y-1/2 bg-white/90 border border-gray-200 text-gray-700 w-10 h-10 rounded-full shadow-md z-10 hidden group-hover:flex items-center justify-center font-bold text-lg hover:bg-gray-100 transition-all"
        >
          ❯
        </button>
      </section>

      {/* ─── 4. KHU VỰC TOP 10 XEM NHIỀU NHẤT (TRƯỢT NGANG NÂNG CAO) ─── */}
      <section className="relative group">
        <h2 className="text-xl font-bold text-blue-600 mb-4">
          👀 Top 10 Căn Hộ Có Lượt Xem Nhiều Nhất
        </h2>

        <button
          type="button"
          onClick={() => handleScrollHorizontal(mostViewedRef, "left")}
          className="absolute left-[-15px] top-[55%] -translate-y-1/2 bg-white/90 border border-gray-200 text-gray-700 w-10 h-10 rounded-full shadow-md z-10 hidden group-hover:flex items-center justify-center font-bold text-lg hover:bg-gray-100 transition-all"
        >
          ❮
        </button>

        <div
          ref={mostViewedRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {mostViewed.map((apt) => (
            <ApartmentCard
              key={apt._id}
              data={apt}
              isSlider={true}
              showBadge="view"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleScrollHorizontal(mostViewedRef, "right")}
          className="absolute right-[-15px] top-[55%] -translate-y-1/2 bg-white/90 border border-gray-200 text-gray-700 w-10 h-10 rounded-full shadow-md z-10 hidden group-hover:flex items-center justify-center font-bold text-lg hover:bg-gray-100 transition-all"
        >
          ❯
        </button>
      </section>
    </div>
  );
};

// Component con: Thẻ hiển thị căn hộ (Tương thích cả Grid và Slider trượt ngang)
const ApartmentCard = ({ data, isSlider, showBadge }) => {
  const dispatch = useDispatch();

  const handleAddToWishlist = (e) => {
    e.preventDefault(); // Chặn hành động chuyển trang nếu thẻ card có bọc thẻ Link
    e.stopPropagation(); // Chặn sự kiện nổi bọt

    // Gọi API lưu vào danh sách quan tâm trên Database
    dispatch(addToCartThunk({ apartmentId: data._id }));
    alert(`Đã thêm căn hộ "${data.title}" vào danh sách quan tâm!`);
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${isSlider ? "w-[285px] shrink-0 snap-start" : "w-full"}`}
    >
      <div>
        <div className="relative group/img">
          {" "}
          {/* Thêm group/img để tạo hiệu ứng hover */}
          <img
            src={data.images?.[0] || "https://via.placeholder.com/400x250"}
            alt={data.title}
            className="w-full h-44 object-cover"
          />
          {/* 🔹 NÚT TRÁI TIM YÊU THÍCH LƠ LỬNG TRÊN ẢNH */}
          <button
            type="button"
            onClick={handleAddToWishlist}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 p-2 rounded-full shadow-md transition-all z-20 text-xs font-bold"
            title="Thêm vào danh sách quan tâm"
          >
            ❤
          </button>
          {showBadge === "sold" && (
            <span className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg shadow-sm">
              🔥 Đã cọc: {data.soldCount} căn
            </span>
          )}
        </div>

        <div className="p-4 space-y-1">
          <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">
            ID: {data.category?.slice(-6)}
          </span>
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 h-10 leading-5">
            {data.title}
          </h3>
          <p className="text-base font-black text-blue-600 pt-1">
            {data.price?.toLocaleString()} VNĐ
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-gray-50 flex justify-between text-[11px] text-gray-400 mt-2 font-medium">
        <span>
          Còn trống: <b className="text-gray-700">{data.inventory}</b>
        </span>
        <span>
          Diện tích:{" "}
          <b className="text-gray-700">{data.features?.area || 0}m²</b>
        </span>
      </div>
    </div>
  );
};

export default HomePage;
