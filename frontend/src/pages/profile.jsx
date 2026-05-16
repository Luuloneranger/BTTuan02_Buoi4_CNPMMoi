import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProfilePage = () => {
  // Đọc thông tin user đăng nhập từ kho lưu trữ toàn cục của Redux
  const { user } = useSelector((state) => state.auth);

  // Cơ chế Bảo vệ Tuyến đường (Route Protection) - Nếu chưa đăng nhập thì ép quay xe về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {/* Banner màu sắc thẩm mỹ */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-28"></div>

        <div className="p-6 relative">
          {/* Vùng ảnh đại diện giả lập */}
          <div className="w-24 h-24 bg-blue-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-2xl font-black text-blue-600 absolute -top-12 left-6">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="pt-14 border-b pb-4 mb-4">
            <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Thành viên chính thức của hệ thống Luxury Apartment
            </p>
          </div>

          {/* Chi tiết dữ liệu tài khoản cá nhân */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 text-xs font-semibold uppercase">
                Địa chỉ Email
              </span>
              <p className="text-gray-700 font-medium mt-0.5">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-semibold uppercase">
                Cấp bậc tài khoản
              </span>
              <p className="mt-0.5">
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-bold rounded-full border border-blue-200">
                  Thành viên Kim Cương
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách các suất cọc phòng mô phỏng của tài khoản thành viên */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mt-6">
        <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">
          🗒️ Lịch sử đăng ký đặt chỗ căn hộ
        </h3>
        <div className="border rounded-xl overflow-hidden text-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold">
              <tr>
                <th className="p-3">Mã Giao Dịch</th>
                <th className="p-3">Tên Căn Hộ</th>
                <th className="p-3">Ngày Đăng Ký</th>
                <th className="p-3">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              <tr>
                <td className="p-3 font-medium text-blue-600">#LX-8892</td>
                <td className="p-3">Căn hộ Studio Block A - Phòng 12.04</td>
                <td className="p-3">15/05/2026</td>
                <td className="p-3">
                  <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 text-xs font-medium rounded border border-yellow-200">
                    Chờ duyệt cọc
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
