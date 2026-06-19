import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const cartModal = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model("Cart", cartModal);

export default Cart;
