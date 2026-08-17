const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },

    // thông tin thanh toán
    paymentMethod: {
      type: String,
      enum: ["DIRECT_CASH", "VNPAY_MOMO"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "REFUNDED"],
      default: "PENDING",
    },
    totalAmount: { type: Number, required: true },
    checkInDate: { type: Date, required: true },

    cleaningService: {
      isRegistered: { type: Boolean, default: false },
      stepStatus: {
        type: String,
        enum: ["NOT_STARTED", "COLLECTING_WASTE", "DEEP_CLEANING", "DONE"],
        default: "NOT_STARTED",
      },
    },

    smartHomeService: {
      isRegistered: { type: Boolean, default: false },
      activationStatus: {
        type: String,
        enum: ["INACTIVE", "ACTIVATED"],
        default: "INACTIVE",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Contract", ContractSchema);
