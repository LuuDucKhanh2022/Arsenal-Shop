const Category = require("../models/CategoryModel");
const SubCategory = require("../models/SubCategoryModel");
const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    success: true,
    category,
  });
});

exports.getCategoryDetails = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new ErrorHandler(
        404,
        `No category were found matching this id: ${req.params.id}`
      )
    );
  }
  res.status(200).json({
    success: true,
    category,
  });
});

exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorHandler(
        404,
        `No category were found matching this id: ${req.params.id}`
      )
    );
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    // option
    new: true,
    runValidators: true,
    useUnified: false,
  });
  res.status(200).json({
    success: true,
    category,
  });
});

// stop business
exports.stopBusinessCategory = catchAsyncErrors(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new ErrorHandler(
        404,
        `No category were found matching this id: ${req.params.id}`
      )
    );
  }
  if (req.body.state !== undefined) {
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      // option
      new: true,
      runValidators: true,
      useUnified: false,
    });
  } else {
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { state: 0 },
      {
        // option
        new: true,
        runValidators: true,
        useUnified: false,
      }
    );
  }
  await SubCategory.updateMany({ category :req.params.id}, { state: 0});
  await Product.updateMany({ category :req.params.id}, { state: 0});
  res.status(200).json({
    success: true,
    categoryUpdated: category,
  });
});

exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
  let allCategories = await Category.find({state:1});
  const allSubCategories = await SubCategory.find().populate("category");
  allCategories = allCategories.map((category) => {
    
    let subCategories = allSubCategories.filter((subCategory) => 
      subCategory.category.name === category.name && subCategory.state === 1
    );
    subCategories = subCategories.map((subCategory) => {
      const {category: _, ...newSubCategory} = subCategory._doc;

      return newSubCategory;
    })
    category={ ...category._doc, subCategories:subCategories };
    
    return category;
  });
  res.status(200).json({
    success: true,
    allCategories,
  });
});
