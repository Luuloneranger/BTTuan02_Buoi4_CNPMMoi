const Apartment = require("../models/Apartment");

const getApartments = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, bedrooms } = req.query;
    let queryCondition = {};

    if (search) {
      queryCondition.title = { $regex: search, $options: "i" };
    }

    if (category) {
      queryCondition.category = category;
    }

    if (minPrice || maxPrice) {
      queryCondition.price = {};
      if (minPrice) queryCondition.price.$gte = Number(minPrice);
      if (maxPrice) queryCondition.price.$lte = Number(maxPrice);
    }

    if (bedrooms) {
      queryCondition["features.bedrooms"] = Number(bedrooms);
    }

    const apartments = await Apartment.find(queryCondition);
    return res.status(200).json(apartments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi lấy danh sách căn hộ" });
  }
};

// Xem chi tiết căn hộ
const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } }, // ✅ INCREMENT VIEW COUNT ATOMICALLY
      { new: true },
    );
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const apartments = await Apartment.find({ category: categoryId })
      .skip(skip)
      .limit(limit);

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

const getTopFeatures = async (req, res) => {
  try {
    const bestSellers = await Apartment.find()
      .sort({ soldCount: -1 })
      .limit(10);

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
