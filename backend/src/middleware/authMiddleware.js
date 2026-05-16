const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập! Vui lòng gửi kèm Token." });
  }
  s;

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

module.exports = { verifyToken };
