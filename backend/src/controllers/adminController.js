const Contract = require("../models/Contract");
const Apartment = require("../models/Apartment");

// 1. Lấy danh sách hợp đồng đang chờ duyệt
const getPendingContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({ paymentStatus: "PENDING" })
      .populate("userId", "name email")
      .populate("apartmentId", "title price")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi tải hợp đồng chờ duyệt: " + error.message });
  }
};

// 2. Lấy danh sách kiểm kê tồn kho căn hộ
const getApartmentsInventory = async (req, res) => {
  try {
    const inventory = await Apartment.find({})
      .select("title inventory soldCount price category")
      .sort({ soldCount: -1 });

    return res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi tải dữ liệu tồn kho: " + error.message });
  }
};

module.exports = {
  getPendingContracts,
  getApartmentsInventory,
};
