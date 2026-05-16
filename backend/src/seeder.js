const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Apartment = require("./models/Apartment"); // Đảm bảo đúng tên file model trong src/models/

// Bộ dữ liệu mẫu chuẩn khớp 100% với Schema của bạn
const mockData = [
  {
    title: "Căn hộ Studio Block A - View Nội Khu",
    description:
      "Căn hộ Studio thiết kế tối giản, thông minh, tối ưu hóa không gian sống. Thích hợp cho người độc thân hoặc chuyên gia nước ngoài làm việc tại khu công nghệ cao. Bàn giao đầy đủ nội thất cơ bản.",
    category: "6645a1b2c3d4e5f6a7b8c901",
    price: 1500000000,
    discountPrice: 1400000000,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    inventory: 5,
    soldCount: 18,
    isPromoted: true,
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
    },
  },
  {
    title: "Căn hộ Luxury 1 Phòng Ngủ - Block B Ban Công Đông Nam",
    description:
      "Căn hộ 1PN thuộc phân khu cao cấp, sở hữu ban công hướng Đông Nam mát mẻ, view trọn tiện ích hồ bơi tràn bờ. Hệ thống cửa kính cách âm low-e cao cấp kịch trần.",
    category: "6645a1b2c3d4e5f6a7b8c902",
    price: 2450000000,
    discountPrice: 0,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    ],
    inventory: 3,
    soldCount: 32,
    isPromoted: false,
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 52,
    },
  },
  {
    title: "Căn Hộ Gia Đình 2PN Căn Góc Góc Block C",
    description:
      "Căn góc sở hữu 2 mặt thoáng, tầng trung lộng gió tầm nhìn không bị chắn. Thiết kế 2 phòng ngủ biệt lập, phòng khách rộng rãi có khu vực đặt bàn ăn lớn cho gia đình.",
    category: "6645a1b2c3d4e5f6a7b8c903",
    price: 3800000000,
    discountPrice: 0,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800",
    ],
    inventory: 8,
    soldCount: 4,
    isPromoted: false,
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 76,
    },
  },
  {
    title: "Siêu Phẩm Sky Villa Penthouse Thông Tầng Đẳng Cấp",
    description:
      "Biệt thự trên không Penthouse thông tầng cao cấp nhất dự án. Thiết kế hồ bơi riêng, sân vườn ngoài trời rộng 50m2, tầm nhìn panorama 360 độ ôm trọn cảnh sông và trung tâm thành phố.",
    category: "6645a1b2c3d4e5f6a7b8c904",
    price: 12500000000,
    discountPrice: 11900000000,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
    ],
    inventory: 1,
    soldCount: 0,
    isPromoted: true,
    features: {
      bedrooms: 4,
      bathrooms: 4,
      area: 240,
    },
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
