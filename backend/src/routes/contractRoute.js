const express = require("express");
const router = express.Router();
const {
  createApartmentBooking,
  getResidentDashboard,
  getMyContractsHistory,
  approveContract,
  rejectContract,
  updateCleaningStatus
} = require("../controllers/contractController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/booking", verifyToken, createApartmentBooking);
router.get("/resident-dashboard", verifyToken, getResidentDashboard);
router.get("/my-contracts", verifyToken, getMyContractsHistory);
router.post("/:id/approve", verifyToken, verifyAdmin, approveContract);
router.post("/:id/reject", verifyToken, verifyAdmin, rejectContract);
router.patch("/:id/cleaning-status", verifyToken, verifyAdmin, updateCleaningStatus);

module.exports = router;
