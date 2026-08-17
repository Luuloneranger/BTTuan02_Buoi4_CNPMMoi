const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const otpCache = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "luuga000@gmail.com",
    pass: process.env.EMAIL_PASS || "...................",
  },
});

const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Vui lòng nhập Email" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Mã 6 số
  try {
    otpCache.set(email, {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 phút
    });

    console.log(`=== MÃ OTP CỦA [${email}] LÀ: ${otp} ===`); // In ra console dự phòng

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"Hệ thống Căn hộ" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Mã OTP Xác Nhận Tài Khoản",
        html: `<h3>Mã OTP của bạn là: <b style="color: blue;">${otp}</b></h3><p>Mã này sẽ hết hạn sau 5 phút.</p>`,
      });
    } else {
      console.log(
        "⚠️ EMAIL_USER hoặc EMAIL_PASS chưa cấu hình trong .env. Chỉ log ra console.",
      );
    }

    return res
      .status(200)
      .json({
        message:
          "Mã OTP đã được gửi! Kiểm tra email (hoặc console nếu chưa cấu hình email).",
      });
  } catch (error) {
    console.error("Lỗi gửi email OTP:", error);
    return res.status(500).json({ message: "Lỗi lưu/gửi OTP hệ thống" });
  }
};

const register = async (req, res) => {
  const { name, email, password, otp } = req.body;
  try {
    const cachedData = otpCache.get(email);
    if (
      !cachedData ||
      cachedData.otp !== otp ||
      Date.now() > cachedData.expiresAt
    ) {
      return res
        .status(400)
        .json({ message: "Mã OTP không chính xác hoặc đã hết hạn!" });
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

    if (newUser) otpCache.delete(email);

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

// 4. Reset mật khẩu
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const cachedData = otpCache.get(email);
    if (
      !cachedData ||
      cachedData.otp !== otp ||
      Date.now() > cachedData.expiresAt
    ) {
      return res
        .status(400)
        .json({ message: "Mã OTP không chính xác hoặc đã hết hạn!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    otpCache.delete(email);

    return res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống khi đặt lại mật khẩu" });
  }
};

// 5. Lấy thông tin profile từ DB (Sync Profile)
const getProfile = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const user = await User.findById(currentUserId).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    return res.status(200).json({
      message: "Vào trang Profile thành công!",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi lấy thông tin cá nhân" });
  }
};

module.exports = { sendOTP, register, login, resetPassword, getProfile };
