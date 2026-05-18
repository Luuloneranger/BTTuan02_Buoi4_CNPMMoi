import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopFeaturesThunk } from "../store/apartmentSlice";
import { Link } from "react-router-dom";

const HorizontalSlider = () => {
  const dispatch = useDispatch();
  const { bestSellers, mostViewed } = useSelector((state) => state.apartments);

  const sellerRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTopFeaturesThunk());
  }, [dispatch]);

  // Logic nhấn nút dịch chuyển thanh cuộn ngang sang Trái hoặc Phải
  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300; // Khoảng cách dịch chuyển mỗi lần bấm (px)
      ref.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* ─── THANH TRƯỢT 1: TOP 10 BÁN CHẠY NHẤT ─── */}
      <div className="relative group">
        <h2 className="text-lg font-bold text-amber-600 mb-4 flex items-center gap-1">
          🏆 Top 10 Căn Hộ Được Đặt Cọc Nhiều Nhất
        </h2>

        {/* Nút bấm chuyển trang ngang sang Trái */}
        <button
          onClick={() => scroll(sellerRef, "left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 border p-2 rounded-full shadow z-10 hidden group-hover:block hover:bg-gray-100 font-bold"
        >
          ❮
        </button>

        {/* Vùng chứa cuộn ngang tích hợp Snap khóa màn hình của Tailwind */}
        <div
          ref={sellerRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-none"
        >
          {bestSellers.map((apt) => (
            <div
              key={apt._id}
              className="min-w-[260px] md:min-w-[290px] bg-white border rounded-xl overflow-hidden snap-start shadow-sm flex-shrink-0"
            >
              <img
                src={apt.images?.[0]}
                alt=""
                className="w-full h-36 object-cover"
              />
              <div className="p-3">
                <h4 className="font-semibold text-gray-800 text-sm truncate">
                  {apt.title}
                </h4>
                <p className="text-blue-600 font-bold text-xs mt-1">
                  {apt.price?.toLocaleString()} VNĐ
                </p>
                <p className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium mt-2 inline-block">
                  ⭐ Đã cọc: {apt.soldCount} căn
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Nút bấm chuyển trang ngang sang Phải */}
        <button
          onClick={() => scroll(sellerRef, "right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 border p-2 rounded-full shadow z-10 hidden group-hover:block hover:bg-gray-100 font-bold"
        >
          ❯
        </button>
      </div>

      {/* ─── THANH TRƯỢT 2: TOP 10 XEM NHIỀU NHẤT ─── */}
      <div className="relative group">
        <h2 className="text-lg font-bold text-blue-600 mb-4">
          👀 Top 10 Căn Hộ Được Xem Nhiều Nhất
        </h2>
        <button
          onClick={() => scroll(viewRef, "left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 border p-2 rounded-full shadow z-10 hidden group-hover:block hover:bg-gray-100 font-bold"
        >
          ❮
        </button>

        <div
          ref={viewRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-none"
        >
          {mostViewed.map((apt) => (
            <div
              key={apt._id}
              className="min-w-[260px] md:min-w-[290px] bg-white border rounded-xl overflow-hidden snap-start shadow-sm flex-shrink-0"
            >
              <img
                src={apt.images?.[0]}
                alt=""
                className="w-full h-36 object-cover"
              />
              <div className="p-3">
                <h4 className="font-semibold text-gray-800 text-sm truncate">
                  {apt.title}
                </h4>
                <p className="text-blue-600 font-bold text-xs mt-1">
                  {apt.price?.toLocaleString()} VNĐ
                </p>
                <p className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium mt-2 inline-block">
                  👁️ Lượt xem: {apt.viewsCount || 0} lượt
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(viewRef, "right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 border p-2 rounded-full shadow z-10 hidden group-hover:block hover:bg-gray-100 font-bold"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default HorizontalSlider;
