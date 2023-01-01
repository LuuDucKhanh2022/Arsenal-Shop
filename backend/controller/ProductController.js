const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const Category = require("../models/CategoryModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const SubCategoryModel = require("../models/SubCategoryModel");

//create product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  req.body.size = JSON.parse(req.body.size);
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 8;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          // khong phan biet hoa thuong
          $options: "i",
        },
      }
    : {};
  let queryCopy = { ...keyword, ...req.query };

  if (req.query.category) {
    let category;
    req.query.category = req.query.category.replaceAll("-", " ");
    category = await Category.findOne({ name: req.query.category });
    queryCopy = { ...queryCopy, category: category._id };
    if (req.query.subcategory) {
      let subCategory;
      req.query.subcategory = req.query.subcategory.replaceAll("-", " ");
      subCategory = await SubCategoryModel.findOne({
        name: req.query.subcategory,
      });
      queryCopy = { ...queryCopy, subCategory: subCategory._id };
    }
  }
  queryCopy = { ...queryCopy, state: 1 };
  const removeFields = ["keyword", "page", "limit", "sort", "subcategory"];
  removeFields.forEach((key) => delete queryCopy[key]);
  const currentPage = Number(req.query.page) || 1;
  const skip = resultPerPage * (currentPage - 1);
  const sort = req.query.sort;
  let products;
  const productsCount = await Product.find(queryCopy)
    .populate("category", "name")
    .populate("subCategory", "name")
    .countDocuments();
  switch (sort) {
    case "price_asc":
      products = await Product.find(queryCopy)
        .populate("category", "name")
        .populate("subCategory", "name")
        .sort({ price: 1 })
        .limit(resultPerPage)
        .skip(skip);
      break;
    case "price_desc":
      products = await Product.find(queryCopy)
        .populate("category", "name")
        .populate("subCategory", "name")
        .sort({ price: -1 })
        .limit(resultPerPage)
        .skip(skip);
      break;
    case "newest":
      products = await Product.find(queryCopy)
        .populate("category", "name")
        .populate("subCategory", "name")
        .sort({ createdAt: -1 })
        .limit(resultPerPage)
        .skip(skip);
      break;
    case "ratings":
      products = await Product.find(queryCopy)
        .populate("category", "name")
        .populate("subCategory", "name")
        .sort({ ratings: -1 })
        .limit(resultPerPage)
        .skip(skip);
      break;
    default:
      products = await Product.find(queryCopy)
        .populate("category", "name")
        .populate("subCategory", "name")
        .sort({ createdAt: -1 })
        .limit(resultPerPage)
        .skip(skip);
  }
  res.status(200).json({
    success: true,
    products,

    productsCount,
    resultPerPage,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({ state: 1 })
    .populate("category")
    .populate("subCategory");

  res.status(200).json({
    success: true,
    products,
  });
});

exports.getProductCategory = catchAsyncErrors(async (req, res) => {
  const Categories = await Category.find({ state: 1 });
  let products = await Product.find({ state: 1 })
    .populate("category")
    .populate("subCategory");
  const productCategory = Categories.map((category) => {
    return {
      category: category.name,
      products: products
        .filter((product) => product.category.name === category.name)
        .slice(0, 4),
    };
  });

  res.status(200).json({
    success: true,
    productCategory,
    // Categories
  });
});

exports.stopBusiness = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorHandler(
        404,
        `No products were found matching this id: ${req.params.id}`
      )
    );
  }
  if (req.body.state !== undefined) {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      // option
      new: true,
      runValidators: true,
      useUnified: false,
    });
  } else {
    product = await Product.findByIdAndUpdate(
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

  res.status(200).json({
    success: true,
    productUpdated: product,
  });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorHandler(
        404,
        `No products were found matching this id: ${req.params.id}`
      )
    );
  }

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (req.body.images && req.body.images[0].public_id !== "testing.com") {
    if (images !== undefined) {
      // Delete image from cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }

      const imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.images = imagesLinks;
    }
  }

  if (req.body.size.length !== 0) {
    req.body.size = JSON.parse(req.body.size);
  }
  let objUpdate = req.body;
  if(req.body.offerPrice === undefined) {
    objUpdate = { $set:req.body, $unset: { offerPrice: 1 }}
  }
  product = await Product.findByIdAndUpdate(req.params.id, objUpdate, {
    // option
    new: true,
    runValidators: true,
    useUnified: false,
  });
  res.status(200).json({
    success: true,
    productUpdated: product,
  });
});

exports.updateProductImg = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    // option
    new: true,
    runValidators: true,
    useUnified: false,
  });
  res.status(200).json({
    success: true,
    productUpdated: product,
  });
});

//delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorHandler(
        404,
        `No products were found matching this id: ${req.params.id}`
      )
    );
  }

  // Deleting images from cloudinary
  for (let i = 0; 1 < product.images.length; i++) {
    const result = await cloudinary.v2.uploader.destroy(
      product.images[i].public_id
    );
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted succesfully",
  });
});

//getSingleProduct

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("subCategory", "name");
  if (!product) {
    return next(
      new ErrorHandler(
        404,
        `No products were found matching this id: ${req.params.id}`
      )
    );
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  // check buy product
  let purchased = false;
  const orders = await Order.find( {user: req.user._id});

  if(orders.length === 0) {
    return next(new ErrorHandler(401, "You need to have purchased the product to be able to review it!"));
  } else {
    for( let i = 0; i < orders.length ; i++) {
      if(orders[i].orderItems.find( (orderItem) => orderItem.id === productId) !== undefined) {
        purchased = true;
        break;
      }
    }
    if(purchased === false) {
      return next(new ErrorHandler(401, "You need to have purchased the product to be able to review it!"));
    }
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar.url,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
      {
        switch(rev.rating) {
          case 5:
            product.numOfReviews.fiveStar -=1;
            break;
          case 4:
            product.numOfReviews.fourStar -=1;
            break;
          case 3:
            product.numOfReviews.threeStar -=1;
            break;
          case 2:
            product.numOfReviews.twoStar -=1;
            break;
          case 1:
            product.numOfReviews.oneStar -=1;
              
        }
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews.total = product.reviews.length;
  }

  switch (review.rating) {
    case 5:
      product.numOfReviews.fiveStar += 1;
      break;
    case 4:
      product.numOfReviews.fourStar += 1;
      break;
    case 3:
      product.numOfReviews.threeStar += 1;
      break;
    case 2:
      product.numOfReviews.twoStar += 1;
      break;
    case 1:
      product.numOfReviews.oneStar += 1;   
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message:"Review done successfully reload for watch it!"
  });
});

// Get All reviews of a single product
exports.getSingleProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler(404, "Product is not found with this id"));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review --Admin
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler(404, "Product not found with this id"));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let sum = 0;

  reviews.forEach((rev) => {
    sum += rev.rating;
  });

  let ratings = 0;

  if (reviews.length !== 0) {
    ratings = sum / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
