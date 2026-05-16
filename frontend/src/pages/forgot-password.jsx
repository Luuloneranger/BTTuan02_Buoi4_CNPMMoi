import React, { useState } from "react";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Yêu cầu gửi OTP khôi phục mật khẩu mật khẩu
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await axiosClient.post("/auth/send-otp", { email });
      setIsOtpSent(true);
      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Địa chỉ email không tồn tại trên hệ thống!",
      );
    }
  };

  // Xác nhận OTP và cập nhật mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setError("");
      // Gửi API lên backend kiểm tra OTP lưu trong Redis
      await axiosClient.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      alert(
        "Đổi mật khẩu thành công! Bạn sẽ được chuyển hướng về trang Đăng nhập.",
      );
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Mã OTP không chính xác hoặc đã hết hiệu lực.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
          Khôi Phục Mật Khẩu
        </h2>
        <p className="text-xs text-gray-400 text-center mb-6">
          Mã OTP xác thực sẽ được lưu trữ an toàn bằng Redis Cache trong thời
          hạn 5 phút.
        </p>

        {message && (
          <div className="p-3 mb-4 text-xs text-green-700 bg-green-50 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 mb-4 text-xs text-red-700 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {!isOtpSent ? (
          <form onSubmit={handleRequestOtp}>
            <InputField
              label="Nhập Email tài khoản cần khôi phục"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
            />
            <Button type="submit">Gửi mã xác thực OTP</Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-2">
            <InputField
              label="Nhập mã OTP (Kiểm tra Log Console của Backend)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="******"
            />
            <InputField
              label="Nhập Mật khẩu mới thiết lập"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit">Cập Nhật Mật Khẩu</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
