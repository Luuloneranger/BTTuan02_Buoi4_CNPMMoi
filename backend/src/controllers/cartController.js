const authMiddleware = require("../middleware/authMiddleware");
const Contract = require("../models/Contract");
const Cart = require("../models/Cart");
const Apartment = require("../models/Apartment");

const getCart = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Hết hạn phiên làm việc, vui lòng đăng nhập lại!",
      });
    }

    let cart = await Cart.findOne({ userId: currentUserId }).populate(
      "items.apartmentId",
    );
    if (!cart) {
      cart = await Cart.create({ userId: currentUserId, items: [] });
    }
    return res.status(200).json({ success: true, data: cart.items });
  } catch (error) {
    console.error("LỖI API GET /CART:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { apartmentId } = req.body;

    const currentUserId = req.user?._id || req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Hành động yêu cầu đăng nhập tài khoản cư dân!",
      });
    }

    const apartment = await Apartment.findById(apartmentId);
    if (!apartment || apartment.inventory <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Căn hộ không khả dụng hoặc đã hết hàng, không thể thêm vào giỏ!",
      });
    }

    let cart = await Cart.findOne({ userId: currentUserId });

    if (!cart) {
      cart = new Cart({ userId: currentUserId, items: [] });
    }

    const isExist = cart.items.some(
      (item) => item.apartmentId && item.apartmentId.toString() === apartmentId,
    );
    if (!isExist) {
      cart.items.push({ apartmentId });
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Đã thêm vào danh sách quan tâm thành công!",
      data: cart.items,
    });
  } catch (error) {
    console.error("LỖI API POST /CART/ADD:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi thêm căn hộ quan tâm: " + error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const apartmentId = req.params.id || req.body.apartmentId;
    const currentUserId = req.user?._id || req.user?.id;

    if (!currentUserId) {
      return res
        .status(401)
        .json({ success: false, message: "Yêu cầu đăng nhập tài khoản!" });
    }

    let cart = await Cart.findOne({ userId: currentUserId });

    if (cart) {
      cart.items = cart.items.filter(
        (item) =>
          item.apartmentId && item.apartmentId.toString() !== apartmentId,
      );
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Đã xóa căn hộ khỏi danh sách quan tâm vĩnh viễn!",
      data: cart ? cart.items : [],
    });
  } catch (error) {
    console.error("LỖI HÀM REMOVE_FROM_CART:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xóa căn hộ quan tâm: " + error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;

    if (!currentUserId) {
      return res
        .status(401)
        .json({ success: false, message: "Yêu cầu đăng nhập tài khoản!" });
    }

    await Cart.findOneAndUpdate({ userId: currentUserId }, { items: [] });

    return res.status(200).json({
      success: true,
      message: "Đã làm sạch danh sách quan tâm sau khi ký hợp đồng cọc!",
      data: [],
    });
  } catch (error) {
    console.error("LỖI HÀM CLEAR_CART:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi làm sạch giỏ hàng: " + error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
