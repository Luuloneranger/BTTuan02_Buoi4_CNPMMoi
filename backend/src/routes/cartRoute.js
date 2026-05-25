const { verifyToken } = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");
const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");
const express = require("express");
const router = express.Router();

router.use(verifyToken);

router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/remove", removeFromCart);

module.exports = router;
