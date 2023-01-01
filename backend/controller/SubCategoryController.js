const SubCategory = require("../models/SubCategoryModel");
const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.createSubCategory = catchAsyncErrors( async (req, res, next) => {
    const subCategory = await SubCategory.create(req.body);
    res.status(201).json({
        success: true,
        subCategory,
      });
})

exports.getSubCategory = catchAsyncErrors( async (req, res,next)=> {
  const subCategory = await SubCategory.findById(req.params.id).populate("category","name");
  if (!subCategory) {
    return next(
      new ErrorHandler(
        404,
        `No subcategory were found matching this id: ${req.params.id}`
      )
    );
  }
  res.status(200).json({
    success: true,
    subCategory,
  });
})

exports.updateSubCategory = catchAsyncErrors(async (req, res, next) => {
  let subCategory = await SubCategory.findById(req.params.id);

  if (!subCategory) {
    return next(
      new ErrorHandler(
        404,
        `No subcategory were found matching this id: ${req.params.id}`
      )
    );
  }

  // let products = await Product.find({subCategory: req.params.id });
  // products.forEach((product) => {
  //   productUpdated = await Product
  // } )
  subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
    // option
    new: true,
    runValidators: true,
    useUnified: false,
  });
  
  res.status(200).json({
    success: true,
    subCategory,
  });
});

// stop business
exports.stopBusinessSubCategory = catchAsyncErrors(async (req, res, next) => {
  let subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) {
    return next(
      new ErrorHandler(
        404,
        `No subcategory were found matching this id: ${req.params.id}`
      )
    );
  }
  if (req.body.state !== undefined) {
    subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
      // option
      new: true,
      runValidators: true,
      useUnified: false,
    });
  } else {
    subCategory = await SubCategory.findByIdAndUpdate(
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

  const product = await Product.updateMany({ subCategory :req.params.id}, { state: 0});
  res.status(200).json({
    success: true,
    subCategoryUpdated: subCategory,
  });
});

exports.getAllSubCategories = catchAsyncErrors( async ( req, res ,next) => {
  const subCategory = await SubCategory.find({state:1}).populate("category","name");
  res.status(200).json({
    success: true,
    subCategory,
  });
})