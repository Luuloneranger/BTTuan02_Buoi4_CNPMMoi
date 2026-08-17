import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { addToCartThunk } from "../store/cartSlice";
import { Navigation, Pagination } from "swiper/modules";
import axiosClient from "../api/axiosClient";
import Button from "../components/common/Button";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ApartmentDetail = () => {
  const { id } = useParams(); // Lấy mã ID của căn hộ từ thanh URL địa chỉ
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || { user: null });
  const [apartment, setApartment] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const allApartments = useSelector((state) => state.apartments.list);

  useEffect(() => {
    axiosClient
      .get(`/apartments/${id}`)
      .then((res) => setApartment(res.data))
      .catch((err) => console.log("Lỗi tải chi tiết căn hộ", err));
  }, [id]);

  if (!apartment)
    return (
      <p className="text-center py-10 text-gray-500 text-sm">
        Đang tải dữ liệu chi tiết căn hộ...
      </p>
    );

  const handleIncrement = () => {
    if (quantity < apartment.inventory) setQuantity(quantity + 1);
  };
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleProceedToDeposit = async () => {
    if (!user) {
      navigate("/login");
    } else {
      await dispatch(addToCartThunk({ apartmentId: apartment._id }));
      navigate("/cart");
    }
  };

  // Tìm các căn hộ tương tự có cùng loại danh mục (loại trừ căn hiện tại)
  const similarApartments = allApartments
    .filter(
      (item) =>
        item.category === apartment.category && item._id !== apartment._id,
    )
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Chỉ mục danh mục tương ứng (Breadcrumb) */}
      <p className="text-xs text-gray-400">
        Trang chủ / {apartment.category} /{" "}
        <span className="text-gray-700 font-medium">{apartment.title}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border shadow-sm">
        {/* SLIDER ALBUM HÌNH ẢNH CĂN HỘ CỦA SWIPER */}
        <div className="w-full rounded-xl overflow-hidden bg-gray-100">
          {apartment.images?.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="h-80 w-full"
            >
              {apartment.images.map((url, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={url}
                    alt="Apartment Gallery"
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
              Căn hộ chưa cập nhật hình ảnh ảnh
            </div>
          )}
        </div>

        {/* THÔNG TIN CHI TIẾT VÀ SỐ LƯỢNG ĐẶT CỌC */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex gap-2 items-center">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">
                {apartment.category}
              </span>
              {apartment.inventory <= 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase">
                  TẠM HẾT HÀNG
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-1">
              {apartment.title}
            </h1>
            <p className="text-xl font-black text-blue-600 mb-3">
              {apartment.price?.toLocaleString()} VNĐ
            </p>

            {/* Khối báo hàng tồn và đã bán được */}
            <div className="flex gap-3 text-xs font-semibold mb-4">
              <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded border border-green-200">
                🏢 Hàng tồn trống: {apartment.inventory} căn
              </span>
              <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded border border-amber-200">
                ⭐ Đã bán được: {apartment.soldCount} căn
              </span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {apartment.description}
            </p>
          </div>

          <div>
            <Button
              disabled={apartment.inventory <= 0}
              onClick={handleProceedToDeposit}
            >
              {apartment.inventory <= 0
                ? "Tạm Hết Hàng"
                : "Tiến Hành Đăng Ký Đặt Cọc Phòng"}
            </Button>
          </div>
        </div>
      </div>

      {/* SẢN PHẨM / CĂN HỘ TƯƠNG TỰ THUỘC DANH MỤC */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          🏢 Các Căn Hộ Tương Tự Khác
        </h2>
        {similarApartments.length === 0 ? (
          <p className="text-gray-400 text-xs">
            Không tìm thấy căn hộ cùng loại danh mục tương ứng nào khác.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {similarApartments.map((apt) => (
              <Link
                key={apt._id}
                to={`/apartments/${apt._id}`}
                className="bg-white border rounded-xl overflow-hidden p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={apt.images?.[0]}
                  alt=""
                  className="w-full h-32 object-cover rounded-lg"
                />
                <h4 className="font-semibold text-gray-800 text-sm mt-2 truncate">
                  {apt.title}
                </h4>
                <p className="text-xs font-bold text-blue-600 mt-1">
                  {apt.price?.toLocaleString()} VNĐ
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ApartmentDetail;
