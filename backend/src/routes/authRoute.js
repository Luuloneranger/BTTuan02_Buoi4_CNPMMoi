const express = require("express");
const router = express.Router();
const { sendOTP, register, login } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/send-otp", sendOTP);
router.post("/register", register);
router.post("/login", login);

router.get("/profile", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "Vào trang Profile thành công!", user: req.user });
});

module.exports = router;
