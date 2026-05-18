const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Apartment = require("./models/Apartment"); // Đảm bảo đúng tên file model trong src/models/

// Bộ dữ liệu mẫu chuẩn khớp 100% với Schema của bạn
const mockData = [
  // ─── PHÂN KHU STUDIO (Mã danh mục: 6645a1b2c3d4e5f6a7b8c901) ───
  {
    title: "Căn hộ Studio Block A - Căn số 05 Tầng Đẹp",
    description:
      "Studio tối giản, view nội khu yên tĩnh, đầy đủ tiện nghi cho người độc thân.",
    category: "6645a1b2c3d4e5f6a7b8c901",
    price: 1500000000,
    discountPrice: 1400000000,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    ],
    inventory: 5,
    soldCount: 45,
    viewsCount: 250,
    isPromoted: true,
    features: { bedrooms: 1, bathrooms: 1, area: 35 },
  },
  {
    title: "Căn hộ Studio Block A - Căn hộ thông minh 4.0",
    description:
      "Tích hợp hệ thống Smarthome điều khiển bằng giọng nói, đèn tự động cảm biến.",
    category: "6645a1b2c3d4e5f6a7b8c901",
    price: 1600000000,
    discountPrice: 0,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    inventory: 4,
    soldCount: 12,
    viewsCount: 420,
    isPromoted: false,
    features: { bedrooms: 1, bathrooms: 1, area: 38 },
  },
  {
    title: "Căn hộ Studio Block B - View Landmark 81 cực chill",
    description:
      "Thích hợp kinh doanh AirBnB, dòng tiền ổn định, ban công rộng thoáng.",
    category: "6645a1b2c3d4e5f6a7b8c901",
    price: 1750000000,
    discountPrice: 1690000000,
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    inventory: 2,
    soldCount: 38,
    viewsCount: 180,
    isPromoted: true,
    features: { bedrooms: 1, bathrooms: 1, area: 40 },
  },
  {
    title: "Căn hộ Studio Dành Cho Sinh Viên - Block C",
    description:
      "Giá tốt nhất dự án, gần trạm Metro, bàn giao kèm gói nội thất cơ bản.",
    category: "6645a1b2c3d4e5f6a7b8c901",
    price: 1300000000,
    discountPrice: 0,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
    ],
    inventory: 10,
    soldCount: 5,
    viewsCount: 95,
    isPromoted: false,
    features: { bedrooms: 1, bathrooms: 1, area: 32 },
  },

  // ─── PHÂN KHU 1 PHÒNG NGỦ (Mã danh mục: 6645a1b2c3d4e5f6a7b8c902) ───
  {
    title: "Căn hộ Cao Cấp 1PN Block B - Hướng Đông Nam",
    description:
      "Ban công mát mẻ cả ngày, tháp trung tâm bước vài bước ra hồ bơi tràn bờ.",
    category: "6645a1b2c3d4e5f6a7b8c902",
    price: 2450000000,
    discountPrice: 0,
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    inventory: 3,
    soldCount: 55,
    viewsCount: 310,
    isPromoted: false,
    features: { bedrooms: 1, bathrooms: 1, area: 52 },
  },
  {
    title: "Căn hộ 1PN + (Cộng) Thiết Kế Đa Năng",
    description:
      "Có thêm không gian nhỏ làm phòng làm việc hoặc phòng ngủ phụ cho khách.",
    category: "6645a1b2c3d4e5f6a7b8c902",
    price: 2700000000,
    discountPrice: 2600000000,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    ],
    inventory: 6,
    soldCount: 22,
    viewsCount: 510,
    isPromoted: true,
    features: { bedrooms: 1, bathrooms: 1, area: 60 },
  },

  // ─── PHÂN KHU 2 PHÒNG NGỦ (Mã danh mục: 6645a1b2c3d4e5f6a7b8c903) ───
  {
    title: "Căn Hộ Gia Đình 2PN Căn Góc Góc Block C",
    description:
      "Căn góc 2 mặt thoáng, tầng trung lộng gió tầm nhìn không bị chắn.",
    category: "6645a1b2c3d4e5f6a7b8c903",
    price: 3800000000,
    discountPrice: 0,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    inventory: 8,
    soldCount: 60,
    viewsCount: 150,
    isPromoted: false,
    features: { bedrooms: 2, bathrooms: 2, area: 76 },
  },
  {
    title: "Căn hộ 2PN Block D - Sân vườn riêng ngoài ban công",
    description:
      "Sở hữu khoảng sân vườn mini riêng ngay căn hộ, thích hợp nuôi thú cưng.",
    category: "6645a1b2c3d4e5f6a7b8c903",
    price: 4200000000,
    discountPrice: 0,
    images: [
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800",
    ],
    inventory: 3,
    soldCount: 14,
    viewsCount: 620,
    isPromoted: false,
    features: { bedrooms: 2, bathrooms: 2, area: 85 },
  },

  // ─── PHÂN KHU PENTHOUSE (Mã danh mục: 6645a1b2c3d4e5f6a7b8c904) ───
  {
    title: "Siêu Phẩm Sky Villa Penthouse Thông Tầng Thượng Lưu",
    description:
      "Biệt thự trên không tầng cao nhất. Có hồ bơi riêng, view panorama 360 độ toàn thành phố.",
    category: "6645a1b2c3d4e5f6a7b8c904",
    price: 12500000000,
    discountPrice: 11900000000,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    inventory: 1,
    soldCount: 2,
    viewsCount: 890,
    isPromoted: true,
    features: { bedrooms: 4, bathrooms: 4, area: 240 },
  },
  {
    title: "Penthouse President Block Luxury - Bàn giao thô",
    description:
      "Không gian rộng lớn tự do thiết kế theo gu thẩm mỹ cá nhân của gia chủ.",
    category: "6645a1b2c3d4e5f6a7b8c904",
    price: 15000000000,
    discountPrice: 0,
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
    ],
    inventory: 1,
    soldCount: 1,
    viewsCount: 450,
    isPromoted: false,
    features: { bedrooms: 4, bathrooms: 5, area: 310 },
  },
];
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Đang kết nối để nạp dữ liệu mẫu...");

    // Xóa dữ liệu cũ
    await Apartment.deleteMany({});
    console.log("Đã dọn dẹp bảng cũ sạch sẽ.");

    // Nạp dữ liệu mới
    await Apartment.insertMany(mockData);
    console.log(" Đã nạp thành công dữ liệu căn hộ mẫu!");

    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error("Lỗi quá trình nạp dữ liệu:", error);
    process.exit(1);
  }
};

seedDatabase();
