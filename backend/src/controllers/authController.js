const User = require("../models/User");
const redisClient = require("../config/redis");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. Gửi OTP và lưu vào Redis (Hết hạn sau 5 phút)
const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Vui lòng nhập Email" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Mã 6 số
  try {
    if (redisClient.isOpen) {
      await redisClient.setEx(`OTP:${email}`, 300, otp); // Lưu vào Redis 5 phút (300s)
    }
    console.log(`=== MÃ OTP CỦA [${email}] LÀ: ${otp} ===`); // In ra console để test thay vì gửi mail thật
    return res
      .status(200)
      .json({ message: "Mã OTP đã được gửi! Kiểm tra console của Backend." });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi lưu OTP hệ thống" });
  }
};

// 2. Xác thực OTP từ Redis và Đăng ký tài khoản
const register = async (req, res) => {
  const { name, email, password, otp } = req.body;
  try {
    if (redisClient.isOpen) {
      const cachedOtp = await redisClient.get(`OTP:${email}`);
      if (!cachedOtp || cachedOtp !== otp) {
        return res
          .status(400)
          .json({ message: "Mã OTP không chính xác hoặc đã hết hạn!" });
      }
    }

    const userExist = await User.findOne({ email });
    if (userExist)
      return res
        .status(400)
        .json({ message: "Email này đã được đăng ký trước đó!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (redisClient.isOpen) await redisClient.del(`OTP:${email}`); // Xóa sạch OTP sau khi dùng xong

    return res.status(201).json({
      message: "Đăng ký thành công!",
      user: { id: newUser._id, name, email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi đăng ký tài khoản" });
  }
};

// 3. Đăng nhập hệ thống
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không chính xác!" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi đăng nhập" });
  }
};

module.exports = { sendOTP, register, login };
