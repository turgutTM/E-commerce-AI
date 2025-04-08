import bcrypt from "bcrypt";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    profilePhoto: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    joinedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    balance: {
      type: Number,
      default: 10000,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    lastViewedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.deductBalance = async function (amount) {
  if (this.balance >= amount) {
    this.balance -= amount;
    await this.save();
    return true;
  } else {
    throw new Error("Insufficient balance to complete the purchase.");
  }
};

UserSchema.methods.setLastViewedProduct = async function (productId) {
  this.lastViewedProduct = productId;
  await this.save();
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
