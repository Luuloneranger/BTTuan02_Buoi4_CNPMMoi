import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartThunk } from "../store/cartSlice";
import axiosClient from "../api/axiosClient";
import Button from "../components/common/Button";

const BookingCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems, isLoading } = useSelector(
    (state) => state.cart || { items: [] },
  );
  const { user } = useSelector((state) => state.auth || { user: null });

  const [formData, setFormData] = useState({
    checkInDate: "",
    paymentMethod: "DIRECT_CASH",
  });

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState({
    cleaning: false,
    smartHome: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchCartThunk());
    }
  }, [dispatch, user]);

  const getMinCheckInDate = () => {
    const minDays = parseInt(import.meta.env.VITE_MIN_BOOKING_DAYS) || 7;
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + minDays);
    return minDate.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!user) {
      setErrorMessage(
        "🔒 Bạn phải đăng nhập hệ thống mới có quyền thiết lập hồ sơ đặt cọc!",
      );
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage(
        "Giỏ hàng của bạn đang trống, không có căn hộ để đặt cọc!",
      );
      return;
    }

    if (!formData.checkInDate) {
      setErrorMessage("Vui lòng chọn ngày dự kiến nhận bàn giao căn hộ!");
      return;
    }

    const today = new Date();
    const chosenDate = new Date(formData.checkInDate);
    const daysDiff = Math.ceil((chosenDate - today) / (1000 * 3600 * 24));
    const minDays = parseInt(import.meta.env.VITE_MIN_BOOKING_DAYS) || 7;

    if (daysDiff < minDays) {
      setErrorMessage(
        `Lỗi pháp lý: Ngày nhận phòng phải cách ngày lập hồ sơ ít nhất ${minDays} ngày!`,
      );
      return;
    }

    setShowServiceModal(true);
  };

  const handleFinalCheckout = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const targetApartment = cartItems[0];
      const bookingPayload = {
        apartmentId:
          targetApartment.apartmentId?._id ||
          targetApartment.apartmentId ||
          targetApartment._id,
        paymentMethod: formData.paymentMethod,
        totalAmount: targetApartment.depositAmount || 50000000,
        checkInDate: formData.checkInDate,
        registerCleaning: selectedServices.cleaning,
        registerSmartHome: selectedServices.smartHome,
      };

      const response = await axiosClient.post(
        "/contracts/booking",
        bookingPayload,
      );

      if (response.data.success) {
        await axiosClient.delete("/cart/clear");
        dispatch(fetchCartThunk());

        setShowServiceModal(false);
        setSuccessMessage(
          "🎉 Đã thiết lập hồ sơ đặt cọc và đăng ký gói dịch vụ thành công!",
        );

        setTimeout(() => {
          navigate("/resident-dashboard");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Lỗi hệ thống khi ký hợp đồng: " + error.message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      const apartmentId = item.apartmentId?._id || item.apartmentId || item._id;
      if (!apartmentId) {
        setErrorMessage("Không tìm thấy ID căn hộ để tiến hành xóa!");
        return;
      }

      const response = await axiosClient.delete(`/cart/remove/${apartmentId}`);

      if (response.data.success) {
        dispatch(fetchCartThunk());
        setSuccessMessage(
          "🗑️ Đã xóa căn hộ khỏi danh sách quan tâm thành công!",
        );
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Không thể xóa căn hộ khỏi danh sách quan tâm.",
      );
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-blue-600 font-medium">
            Đang đồng bộ dữ liệu cư dân...
          </p>
        </div>
      </div>
    );

  if (cartItems.length === 0 && !successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center space-y-6 border border-white/50">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-2xl font-black text-gray-800">Giỏ hàng trống</h2>
          <p className="text-gray-500 text-sm">
            Bạn chưa chọn căn hộ nào để tiến hành đặt cọc.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const totalDeposit = cartItems.reduce(
    (sum, item) => sum + (item.depositAmount || 50000000),
    0,
  );
  const totalServiceFee =
    (selectedServices.cleaning ? 500000 : 0) +
    (selectedServices.smartHome ? 2500000 : 0);
  const grandTotal = totalDeposit + totalServiceFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl border border-gray-100">
            📝
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Hồ Sơ Đặt Cọc
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Hoàn thiện thủ tục để nhận bàn giao căn hộ
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 mb-8 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-medium shadow-sm flex items-center gap-3">
            <span className="text-xl">✅</span> {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 mb-8 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-medium shadow-sm flex items-center gap-3">
            <span className="text-xl">⚠️</span> {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột trái: Danh sách căn hộ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {cartItems.map((item) => {
              const aptData = item.apartmentId || item;
              return (
                <div
                  key={item._id}
                  className="bg-white/80 backdrop-blur-md border border-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row gap-6 relative group transition-all hover:bg-white"
                >
                  <div className="relative">
                    <img
                      src={
                        aptData.images?.[0] ||
                        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"
                      }
                      alt=""
                      className="w-full sm:w-40 h-32 object-cover rounded-2xl shadow-md"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                      PREMIUM
                    </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">
                          {aptData.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                          Diện tích:{" "}
                          {aptData.features?.area || aptData.area || 0}m²
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-2 -mr-2 -mt-2 bg-slate-50 hover:bg-rose-50 rounded-full"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">
                        Tiền cọc giữ chỗ
                      </span>
                      <span className="text-base font-black text-indigo-600">
                        {(aptData.depositAmount || 50000000).toLocaleString()}{" "}
                        VNĐ
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cột phải: Form thông tin */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-2xl shadow-indigo-100 sticky top-8">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                  1
                </span>
                Thông tin hồ sơ
              </h3>

              <form onSubmit={handleInitialSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Ngày nhận phòng dự kiến
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    min={getMinCheckInDate()}
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                  <p className="text-[11px] font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100/50">
                    ⚠️ Yêu cầu tối thiểu{" "}
                    {parseInt(import.meta.env.VITE_MIN_BOOKING_DAYS) || 7} ngày
                    để nghiệm thu kỹ thuật tòa nhà.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Phương thức thanh toán cọc
                  </label>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === "DIRECT_CASH" ? "border-indigo-500 bg-indigo-50/50" : "border-slate-100 hover:border-slate-300"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === "DIRECT_CASH" ? "border-indigo-500" : "border-slate-300"}`}
                      >
                        {formData.paymentMethod === "DIRECT_CASH" && (
                          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="DIRECT_CASH"
                        className="hidden"
                        checked={formData.paymentMethod === "DIRECT_CASH"}
                        onChange={handleInputChange}
                      />
                      <span className="text-sm font-bold text-slate-700">
                        💵 Đóng tiền mặt tại VP
                      </span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === "VNPAY_MOMO" ? "border-indigo-500 bg-indigo-50/50" : "border-slate-100 hover:border-slate-300"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === "VNPAY_MOMO" ? "border-indigo-500" : "border-slate-300"}`}
                      >
                        {formData.paymentMethod === "VNPAY_MOMO" && (
                          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="VNPAY_MOMO"
                        className="hidden"
                        checked={formData.paymentMethod === "VNPAY_MOMO"}
                        onChange={handleInputChange}
                      />
                      <span className="text-sm font-bold text-slate-700">
                        💳 Quét mã VNPay / Momo
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-sm font-bold text-slate-500">
                      Tạm tính:
                    </span>
                    <span className="text-2xl font-black text-slate-800">
                      {totalDeposit.toLocaleString()}đ
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
                  >
                    Tiếp tục thanh toán ➔
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL MUA GÓI DỊCH VỤ IOT & DỌN DẸP */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowServiceModal(false)}
          ></div>

          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 text-white text-center">
              <h2 className="text-2xl font-black mb-2">
                Trải Nghiệm Sống Đẳng Cấp
              </h2>
              <p className="text-indigo-100 text-sm font-medium">
                Nâng tầm không gian sống của bạn với các dịch vụ đặc quyền trước
                khi dọn vào.
              </p>
            </div>

            <div className="p-8 space-y-6">
              {/* Dịch vụ Dọn dẹp */}
              <div
                onClick={() =>
                  setSelectedServices((prev) => ({
                    ...prev,
                    cleaning: !prev.cleaning,
                  }))
                }
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-5
                  ${selectedServices.cleaning ? "border-blue-500 bg-blue-50/50 shadow-md shadow-blue-100" : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"}`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${selectedServices.cleaning ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-400"}`}
                >
                  ✨
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">
                    Gói Dọn Dẹp Chuyên Sâu
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Vệ sinh công nghiệp toàn diện, diệt khuẩn, khử mùi sơn mới.
                    Căn hộ sẵn sàng 100% khi bạn bước vào.
                  </p>
                </div>
                <div className="text-right">
                  <span className="block font-black text-blue-600">
                    500.000đ
                  </span>
                  <div
                    className={`mt-2 w-6 h-6 rounded-full border-2 ml-auto flex items-center justify-center ${selectedServices.cleaning ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}
                  >
                    {selectedServices.cleaning && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Dịch vụ SmartHome */}
              <div
                onClick={() =>
                  setSelectedServices((prev) => ({
                    ...prev,
                    smartHome: !prev.smartHome,
                  }))
                }
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-5
                  ${selectedServices.smartHome ? "border-purple-500 bg-purple-50/50 shadow-md shadow-purple-100" : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"}`}
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg transform rotate-3">
                  HOT
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${selectedServices.smartHome ? "bg-purple-500 text-white" : "bg-slate-100 text-slate-400"}`}
                >
                  📱
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">
                    Hệ Thống SmartHome Trọn Đời
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Kích hoạt vĩnh viễn bảng điều khiển IoT trên App. Mở cửa,
                    bật tắt đèn, rèm cửa bằng giọng nói.
                  </p>
                </div>
                <div className="text-right">
                  <span className="block font-black text-purple-600">
                    2.500.000đ
                  </span>
                  <div
                    className={`mt-2 w-6 h-6 rounded-full border-2 ml-auto flex items-center justify-center ${selectedServices.smartHome ? "border-purple-500 bg-purple-500" : "border-slate-300"}`}
                  >
                    {selectedServices.smartHome && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-8 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    Tổng thanh toán (gồm Cọc + Dịch vụ):
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-indigo-600">
                    {grandTotal.toLocaleString()}đ
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 py-4 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleFinalCheckout}
                  disabled={isSubmitting}
                  className="flex-[2] py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{" "}
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác Nhận & Đặt Cọc Ngay ➔"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCart;
