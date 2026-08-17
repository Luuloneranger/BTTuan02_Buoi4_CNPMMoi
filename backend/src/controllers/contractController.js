const Contract = require("../models/Contract");
const Apartment = require("../models/Apartment");

const createApartmentBooking = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "🔒 Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!",
      });
    }

    const {
      apartmentId,
      paymentMethod,
      checkInDate,
      registerCleaning,
      registerSmartHome,
    } = req.body;

    const today = new Date();
    const chosenDate = new Date(checkInDate);

    const timeDiff = chosenDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const minDays = parseInt(process.env.MIN_BOOKING_DAYS) || 7;

    if (daysDiff < minDays) {
      return res.status(400).json({
        success: false,
        message: `Theo quy định pháp lý bồi thường và chuẩn bị bàn giao kỹ thuật, ngày nhận phòng sớm nhất phải cách ngày hôm nay ít nhất ${minDays} ngày!`,
      });
    }

    const apartment = await Apartment.findOneAndUpdate(
      { _id: apartmentId, inventory: { $gt: 0 } },
      { $inc: { inventory: -1, soldCount: 1 } },
      { new: true },
    );

    if (!apartment) {
      return res.status(400).json({
        success: false,
        message:
          "Căn hộ này đã hết hàng hoặc đang có người khác thực hiện giao dịch!",
      });
    }

    const depositPercentage = parseFloat(process.env.DEPOSIT_PERCENTAGE) || 10;
    const calculatedTotalAmount = Math.floor(
      apartment.price * (depositPercentage / 100),
    );

    const newContract = new Contract({
      userId: currentUserId,
      apartmentId,
      paymentMethod,
      totalAmount: calculatedTotalAmount,
      checkInDate: chosenDate,
      cleaningService: {
        isRegistered: registerCleaning,
        stepStatus: registerCleaning ? "COLLECTING_WASTE" : "NOT_STARTED",
      },
      smartHomeService: {
        isRegistered: registerSmartHome,
        activationStatus: "INACTIVE",
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

const getResidentDashboard = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "🔒 Vui lòng đăng nhập để xem không gian cư dân!",
      });
    }

    const contract = await Contract.findOne({ userId: currentUserId })
      .sort({ createdAt: -1 })
      .populate("apartmentId");

    if (!contract) {
      return res.status(404).json({
        success: false,
        message:
          "Tài khoản của bạn chưa đăng ký sở hữu hoặc đặt cọc căn hộ nào!",
      });
    }

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
    return res.status(500).json({
      success: false,
      message: "Lỗi tải không gian cư dân: " + error.message,
    });
  }
};

const getMyContractsHistory = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contracts = await Contract.find({ userId: currentUserId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("apartmentId");

    const total = await Contract.countDocuments({ userId: currentUserId });

    return res.status(200).json({
      success: true,
      data: contracts,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasMore: skip + contracts.length < total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi tải lịch sử hợp đồng: " + error.message,
    });
  }
};

const approveContract = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findByIdAndUpdate(
      id,
      { paymentStatus: "PAID" },
      { new: true },
    );
    if (!contract)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hợp đồng" });
    return res
      .status(200)
      .json({ success: true, message: "Duyệt hợp đồng thành công", contract });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống: " + error.message });
  }
};

const rejectContract = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findById(id);
    if (!contract)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hợp đồng" });

    await Apartment.findByIdAndUpdate(contract.apartmentId, {
      $inc: { inventory: 1, soldCount: -1 },
    });

    contract.paymentStatus = "REFUNDED";
    await contract.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Đã hủy hợp đồng và hoàn trả số lượng căn hộ",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống: " + error.message });
  }
};

const updateCleaningStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { stepStatus } = req.body;
    const contract = await Contract.findById(id);
    if (!contract)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hợp đồng" });

    contract.cleaningService.stepStatus = stepStatus;
    await contract.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật trạng thái dọn dẹp thành công",
        data: contract,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống: " + error.message });
  }
};

module.exports = {
  createApartmentBooking,
  getResidentDashboard,
  getMyContractsHistory,
  approveContract,
  rejectContract,
  updateCleaningStatus,
};
