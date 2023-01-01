const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please your Name"],
    minlength: [5, "Please enter a name atleast 5 characters"],
    maxlength: [24, "Name can not big than 24 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password!"],
    minlength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  countryCode: {
    type: String,
    maxlength: [60, "Country can not be greater than 60 characters"],
  },
  stateCode: {
    type: String,
    maxlength: [60, "State can not be greater than 60 characters"],
  },
  address: {
    type: String,
    maxlength: [60, "address can not be greater than 60 chatecters"],
  },
  phoneNo: {
    type: String,
    maxlength: [11, "phone no can not be greater than 11 digits"],
    minlength: [10, "phone no can not be less than 10 digits"],
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isVerified: {
    type:Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Forgot password
userSchema.methods.getResetToken = function () {
  // Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //    hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordTime = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
