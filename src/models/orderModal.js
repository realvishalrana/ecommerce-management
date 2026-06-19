import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalAmount: true,

});

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true, // SNAPSHOT: Store the price at the moment of checkout. If the product price changes in the catalog tomorrow, this historical invoice price remains unchanged.
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true, // Pre-calculated on the server (sum of quantity * snapshot price)
    },
    shippingAddress: {
      // SNAPSHOT: Store the address used for this order. If the user updates their profile address later, this shipment record must not change.
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;