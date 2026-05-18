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

const getApartmentsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1; // Trang hiện tại (Mặc định trang 1)
    const limit = parseInt(req.query.limit) || 4; // Số lượng căn hộ mỗi lần load (Mặc định 4 căn)
    const skip = (page - 1) * limit;

    // Tìm căn hộ thuộc danh mục và thực hiện phân trang bằng .skip() và .limit()
    const apartments = await Apartment.find({ category: categoryId })
      .skip(skip)
      .limit(limit);

    // Tính tổng số lượng để Frontend biết khi nào hết phòng để dừng cuộn
    const totalApartments = await Apartment.countDocuments({
      category: categoryId,
    });
    const hasMore = skip + apartments.length < totalApartments;

    return res
      .status(200)
      .json({ apartments, hasMore, total: totalApartments });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi phân trang danh mục" });
  }
};

// 2. API: Lấy Top 10 Bán chạy nhất và Xem nhiều nhất
const getTopFeatures = async (req, res) => {
  try {
    // Top 10 bán chạy nhất (Sắp xếp giảm dần theo soldCount)
    const bestSellers = await Apartment.find()
      .sort({ soldCount: -1 })
      .limit(10);

    // Top 10 xem nhiều nhất (Sắp xếp giảm dần theo viewsCount)
    const mostViewed = await Apartment.find()
      .sort({ viewsCount: -1 })
      .limit(10);

    return res.status(200).json({ bestSellers, mostViewed });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi tải top sản phẩm" });
  }
};

module.exports = {
  getApartments,
  getApartmentById,
  getApartmentsByCategory,
  getTopFeatures,
};
