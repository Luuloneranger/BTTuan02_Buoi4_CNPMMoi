const express = require("express");
const router = express.Router();
const {
  getPendingContracts,
  getApartmentsInventory,
} = require("../controllers/adminController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.use(verifyToken, verifyAdmin);

router.get("/contracts", getPendingContracts);
router.get("/apartments/inventory", getApartmentsInventory);

module.exports = router;
