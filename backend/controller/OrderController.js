const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get single order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email role"
  );

  if (!order) {
    return next(new ErrorHandler(404, "Order not found with this id"));
  }
  if ((order.user._id !== req.user._id) && req.user.role !== "admin") {
    console.log(order.user._id)
    return next(new ErrorHandler(404, "This order is not owned by you"));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get all orders-user
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All orders ---Admin
exports.getAllAdminOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status ---Admin
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler( 404,"Order not found with this Id"));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler( 400,"You have already delivered this order"));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (item) => {
      await updateStock(item.productId, item.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order ---Admin
exports.deleteOrder = catchAsyncErrors(async (req,res,next) =>{

    const order = await Order.findById(req.params.id);
    
    if(!order){
      return next(new ErrorHandler(404, "Order not found with this Id"));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});