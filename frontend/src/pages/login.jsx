import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginThunk(credentials)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") navigate("/"); // Đăng nhập xong tự nhảy về trang chủ
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full border"
      >
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          Đăng Nhập Thành Viên
        </h2>
        {error && (
          <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
        )}
        <InputField
          label="Email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="your-email@domain.com"
        />
        <InputField
          label="Mật khẩu"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
        <Button type="submit">Đăng Nhập</Button>
        <p className="text-center text-xs text-gray-500 mt-4">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
