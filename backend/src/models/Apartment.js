const mongoose = require("mongoose");

const ApartmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    images: [{ type: String }],
    inventory: { type: Number, required: true },
    soldCount: { type: Number, default: 0 },
    isPromoted: { type: Boolean, default: false },
    features: {
      bedrooms: { type: Number, default: 1 },
      bathrooms: { type: Number, default: 1 },
      area: { type: Number },
    },
    viewCount: { type: Number, default: 0 }, // Số lượt xem căn hộ
  },
  { timestamps: true },
);

module.exports = mongoose.model("Apartment", ApartmentSchema);
