const express = require("express");
const router = express.Router();
const {
  createApartmentBooking,
  getResidentDashboard,
} = require("../controllers/contractController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/booking", verifyToken, createApartmentBooking);
router.get("/resident-dashboard", verifyToken, getResidentDashboard);

module.exports = router;
