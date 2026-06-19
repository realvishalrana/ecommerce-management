import mongoose from "mongoose";

export const USER_ROLE = {
  ADMIN: "admin",
  USER: "user",
};

const AddressSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },
    DOB: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    address: {
      type: AddressSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

// 1. Define the virtual field
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);

export default User;
