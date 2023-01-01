const mongoose = require("mongoose");
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name of a category"],
      trim: true,
      maxLength: [30, "Category name not exceed than 30 characters"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      require: true
    },
    state:  {
      type: Number,
      default : 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
