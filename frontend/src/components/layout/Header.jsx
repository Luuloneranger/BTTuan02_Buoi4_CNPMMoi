import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutAction } from "../../store/authSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="text-xl font-bold text-blue-600 tracking-wide">
        CHUNG CƯ LUXURY
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="text-gray-600 hover:text-blue-600">
          Trang Chủ
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="text-gray-700 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg border"
            >
              👋 {user.name}
            </Link>
            <button
              onClick={() => dispatch(logoutAction())}
              className="text-red-500 hover:underline"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Đăng Nhập
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
