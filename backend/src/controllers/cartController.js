const authMiddleware = require("../middleware/authMiddleware");
const Contract = require("../models/Contract");
const Cart = require("../models/Cart");

// lấy danh sách căn hộ
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.apartmentId",
    );
    if (!cart) {
      // Nếu chưa có giỏ hàng, tự động tạo mới một giỏ trống cho cơ dân
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    return res.status(200).json({ success: true, data: cart.items });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi lấy danh sách quan tâm: " + error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { apartmentId } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const isExist = cart.items.some(
      (item) => item.apartmentId.toString() === apartmentId,
    );
    if (!isExist) {
      cart.items.push({ apartmentId });
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Đã lưu vào danh sách quan tâm!",
      data: cart.items,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi thêm căn hộ quan tâm: " + error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { apartmentId } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.apartmentId.toString() !== apartmentId,
      );
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Đã xóa khỏi danh sách quan tâm!",
      data: cart ? cart.items : [],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi xóa căn hộ quan tâm: " + error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
};
