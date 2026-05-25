import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

const BookingCart = () => {
  // Giả định dữ liệu lấy từ bảng Cart trong Redux Store (gồm các căn hộ đang bấm quan tâm)
  const [cartItems, setCartItems] = useState([
    {
      _id: "apt_01",
      title: "Căn hộ Studio Block A - Căn số 05 Tầng Đẹp",
      price: 1500000000,
      depositAmount: 50000000, // Tiền cọc mặc định là 50 triệu
      image:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      area: 35,
    },
  ]);

  // State quản lý Form thanh toán đặt phòng
  const [formData, setFormData] = useState({
    checkInDate: "",
    paymentMethod: "DIRECT_CASH",
    registerCleaning: false,
    registerSmartHome: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ⚖️ Tính toán ngày nhận phòng tối thiểu (Hôm nay + 7 ngày) theo đúng luật
  const getMinCheckInDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return minDate.toISOString().split("T")[0]; // Định dạng YYYY-MM-DD cho thẻ input
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.checkInDate) {
      setErrorMessage("Vui lòng chọn ngày dự kiến nhận bàn giao căn hộ!");
      return;
    }

    // Kiểm tra lại một lần nữa ở Frontend để chắc chắn ngày chọn hợp lệ
    const today = new Date();
    const chosenDate = new Date(formData.checkInDate);
    const daysDiff = Math.ceil((chosenDate - today) / (1000 * 3600 * 24));

    if (daysDiff < 7) {
      setErrorMessage(
        "Lỗi pháp lý: Ngày nhận phòng phải cách ngày lập hồ sơ ít nhất 7 ngày!",
      );
      return;
    }

    // Giả lập gọi API thành công
    setSuccessMessage(
      "🎉 Đã thiết lập hồ sơ đặt cọc và đăng ký gói dịch vụ thành công!",
    );
    setCartItems([]); // Xóa giỏ hàng sau khi thanh toán
  };

  if (cartItems.length === 0 && !successMessage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-gray-400 text-sm">
          Danh sách căn hộ quan tâm của bạn đang trống.
        </p>
        <a
          href="/"
          className="inline-block text-blue-600 text-xs font-bold hover:underline"
        >
          ➔ Quay lại trang chủ xem phòng
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        🛒 Danh Sách Căn Hộ Đang Quan Tâm & Đặt Chỗ
      </h2>

      {successMessage && (
        <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: HIỂN THỊ CĂN HỘ TRONG GIỎ */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-2xl p-4 flex gap-4 shadow-sm relative"
            >
              <img
                src={item.image}
                alt=""
                className="w-32 h-24 object-cover rounded-xl shrink-0"
              />
              <div className="flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Diện tích: {item.area}m² | Tiêu chuẩn: Cao cấp
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Giá trị:{" "}
                    <span className="font-bold text-gray-700">
                      {item.price.toLocaleString()}đ
                    </span>
                  </p>
                  <p className="text-xs text-blue-600 font-bold mt-0.5">
                    Tiền cọc giữ chỗ: {item.depositAmount.toLocaleString()} VNĐ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCartItems([])}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xs"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>

        {/* CỘT PHẢI: FORM THANH TOÁN ĐẶT CỌC & ĐĂNG KÝ GÓI SỐ */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-gray-800 border-b pb-3 mb-4">
            📝 Thủ Tục Ký Kết & Đặt Cọc
          </h3>

          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            {/* Lịch chọn ngày nhận phòng (Chặn ngày dưới 7 ngày bằng thuộc tính min) */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Ngày nhận phòng dự kiến
              </label>
              <input
                type="date"
                name="checkInDate"
                min={getMinCheckInDate()}
                value={formData.checkInDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                ⚠️ Cần tối thiểu 7 ngày để Ban quản lý nghiệm thu kỹ thuật.
              </p>
            </div>

            {/* Phương thức thanh toán (Thay thế COD) */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">
                Phương thức đóng tiền cọc
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 border p-2.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="DIRECT_CASH"
                    checked={formData.paymentMethod === "DIRECT_CASH"}
                    onChange={handleInputChange}
                    className="text-blue-600"
                  />
                  💵 Đóng tiền mặt trực tiếp tại VP tòa nhà (COD BĐS)
                </label>
                <label className="flex items-center gap-2 border p-2.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY_MOMO"
                    checked={formData.paymentMethod === "VNPAY_MOMO"}
                    onChange={handleInputChange}
                    className="text-blue-600"
                  />
                  💳 Quét mã Ví điện tử / Internet Banking (Kích hoạt ngay)
                </label>
              </div>
            </div>

            {/* ĐĂNG KÝ CÁC GÓI TIỆN ÍCH ĐI KÈM */}
            <div className="border-t pt-3 space-y-2">
              <label className="block text-xs font-bold text-gray-600 mb-2">
                Đăng ký tiện ích tân gia
              </label>

              <label className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  name="registerCleaning"
                  checked={formData.registerCleaning}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div className="text-[11px]">
                  <p className="font-bold text-gray-700">
                    🧹 Gói dọn dẹp nhà mới (Cleaning Service)
                  </p>
                  <p className="text-gray-400">
                    Vệ sinh công nghiệp chuyên sâu trước khi bàn giao.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  name="registerSmartHome"
                  checked={formData.registerSmartHome}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div className="text-[11px]">
                  <p className="font-bold text-blue-600">
                    ⚡ Gói SmartHome Cao Cấp (Trọn đời)
                  </p>
                  <p className="text-gray-400">
                    Mở khóa vĩnh viễn quyền điều khiển thiết bị & giọng nói qua
                    Web.
                  </p>
                </div>
              </label>
            </div>

            <div className="border-t pt-3 mt-2 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600">
                Tổng tiền cọc:
              </span>
              <span className="text-base font-black text-red-600">
                50.000.000đ
              </span>
            </div>

            <Button type="submit">Xác Nhận Ký Hợp Đồng</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingCart;
