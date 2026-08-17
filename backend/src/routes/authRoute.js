const express = require("express");
const router = express.Router();
const { sendOTP, register, login, resetPassword, getProfile } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/send-otp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);

router.get("/profile", verifyToken, getProfile);

module.exports = router;
