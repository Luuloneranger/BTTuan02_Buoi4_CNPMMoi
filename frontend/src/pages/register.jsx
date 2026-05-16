import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOTPThunk, registerThunk } from "../store/authSlice";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { otpSent, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGetOTP = () => {
    if (formData.email) dispatch(sendOTPThunk(formData.email));
    else alert("Vui lòng điền email trước khi nhận OTP");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerThunk(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng Ký Tài Khoản
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-1">
          <InputField
            label="Họ và tên"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
          />

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <InputField
                label="Địa chỉ Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
              />
            </div>
            <button
              type="button"
              onClick={handleGetOTP}
              className="mb-4 bg-gray-800 text-white text-xs font-semibold px-3 py-2.5 rounded-lg hover:bg-gray-700 transition"
            >
              {otpSent ? "Gửi lại" : "Lấy Mã"}
            </button>
          </div>

          {otpSent && (
            <InputField
              label="Nhập mã OTP (Xem tại console của Backend)"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="******"
            />
          )}
          <InputField
            label="Mật khẩu bảo mật"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <Button type="submit">Hoàn Tất Đăng Ký</Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
