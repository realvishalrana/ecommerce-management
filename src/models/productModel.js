import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    slug: {
      type: String, 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// productSchema.pre("save", function () {
//   if (!this.isModified("name") && !this.isModified("category")) {
//     return;
//   }

//   this.slug = slugify(`${this.name} ${this.category}`, {
//     lower: true,
//     strict: true,
//     trim: true,
//   });
// });

const Product = mongoose.model("Product", productSchema);

export default Product;
