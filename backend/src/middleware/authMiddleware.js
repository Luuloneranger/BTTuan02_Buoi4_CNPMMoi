const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập! Vui lòng gửi kèm Token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token đã hết hạn hoặc không hợp lệ!" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const user = await User.findById(currentUserId);
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Không có quyền truy cập. Yêu cầu tài khoản Quản trị viên!" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Lỗi kiểm tra quyền: " + error.message });
  }
};

module.exports = { verifyToken, verifyAdmin };
