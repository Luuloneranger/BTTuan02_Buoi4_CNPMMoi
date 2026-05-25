const Contract = require("../models/Contract");

const createApartmentBooking = async (req, res) => {
  try {
    const {
      apartmentId,
      paymentMethod,
      totalAmount,
      checkInDate,
      registerCleaning,
      registerSmartHome,
    } = req.body;
    const userId = req.user._id;

    const today = new Date();
    const chosenDate = new Date(checkInDate);

    const timeDiff = chosenDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 7) {
      return res.status(400).json({
        success: false,
        message:
          "Theo quy định pháp lý bồi thường và chuẩn bị bàn giao kỹ thuật, ngày nhận phòng sớm nhất phải cách ngày hôm nay ít nhất 7 ngày!",
      });
    }

    // ─── TẠO HỒ SƠ ĐƠN ĐẶT PHÒNG KÈM DỊCH VỤ ───
    const newContract = new Contract({
      userId,
      apartmentId,
      paymentMethod,
      totalAmount,
      checkInDate: chosenDate,
      cleaningService: {
        isRegistered: registerCleaning,
        stepStatus: registerCleaning ? "COLLECTING_WASTE" : "NOT_STARTED", // Nếu đăng ký thì bắt đầu bước 1 luôn
      },
      smartHomeService: {
        isRegistered: registerSmartHome,
        activationStatus: "INACTIVE", // Chờ hệ thống kích hoạt
      },
    });

    await newContract.save();

    return res.status(201).json({
      success: true,
      message: "Đặt cọc căn hộ và đăng ký gói dịch vụ thành công!",
      data: newContract,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi xử lý đặt phòng: " + error.message,
    });
  }
};

// Thêm hàm này vào backend/src/controllers/contractController.js

const getResidentDashboard = async (req, res) => {
  try {
    // Tìm hợp đồng mới nhất của cư dân này và nạp kèm thông tin chi tiết căn hộ
    const contract = await Contract.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 }) // Lấy căn hộ vừa cọc gần nhất
      .populate("apartmentId");

    if (!contract) {
      return res.status(404).json({
        success: false,
        message:
          "Tài khoản của bạn chưa đăng ký sở hữu hoặc đặt cọc căn hộ nào!",
      });
    }

    // Trả về cấu trúc chuẩn để khớp với giao diện ResidentDashboard.jsx hôm trước
    return res.status(200).json({
      success: true,
      data: {
        apartmentNumber: contract.apartmentId?.title || "Căn hộ chưa định danh",
        cleaningService: contract.cleaningService,
        smartHomeService: contract.smartHomeService,
        checkInDate: contract.checkInDate,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Lỗi tải không gian cư dân: " + error.message,
      });
  }
};

// Đừng quên cập nhật module.exports ở cuối file để xuất cả 2 hàm ra ngoài:
module.exports = {
  createApartmentBooking,
  getResidentDashboard, // 🔹 Nhớ thêm chữ này vào export!
};
