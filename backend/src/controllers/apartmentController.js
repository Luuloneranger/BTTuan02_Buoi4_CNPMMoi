const Apartment = require("../models/Apartment");

const getApartments = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, bedrooms } = req.query;
    let queryCondition = {};

    if (search) {
      queryCondition.title = { $regex: search, $options: "i" };
    }

    if (category) {
      queryCondition.category = category; // Lúc này nhận vào ObjectId từ Frontend gửi lên sẽ chuẩn luôn
    }

    if (minPrice || maxPrice) {
      queryCondition.price = {};
      if (minPrice) queryCondition.price.$gte = Number(minPrice);
      if (maxPrice) queryCondition.price.$lte = Number(maxPrice);
    }

    // ❌ SỬA DÒNG NÀY: Vì bedrooms nằm trong features nên phải viết dạng chuỗi lồng nhau
    if (bedrooms) {
      queryCondition["features.bedrooms"] = Number(bedrooms);
    }

    const apartments = await Apartment.find(queryCondition);
    return res.status(200).json(apartments);
  } catch (error) {
    console.error(error); // In lỗi chi tiết ra console của backend để dễ nhìn
    return res.status(500).json({ message: "Lỗi lấy danh sách căn hộ" });
  }
};

// Xem chi tiết căn hộ
const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment)
      return res.status(404).json({ message: "Không tìm thấy căn hộ này!" });
    return res.status(200).json(apartment);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi lấy chi tiết căn hộ" });
  }
};

module.exports = { getApartments, getApartmentById };
