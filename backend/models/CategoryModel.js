const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name of a category"],
      trim: true,
      maxLength: [30, "Category name not exceed than 30 characters"],
    },
    state: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
