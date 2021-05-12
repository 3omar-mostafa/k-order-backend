const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");

const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

// 1. Get my info
module.exports.me = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: "success", user: req.user.toPublic() });
});

// 2. get my orders
module.exports.myOrders = catchAsync(async (req, res, next) => {
  const ordersQueryManager = new DbQueryManager(Order.find({ userID: req.user._id }));
  const myOrders = await ordersQueryManager.all(req.query);
  const totalSize = await ordersQueryManager.totalCount(req.query, Order, {
    userID: req.user._id,
    deleted: { $ne: false },
  });

  res.status(200).json({
    status: "success",
    size: myOrders.length,
    totalSize,
    orders: myOrders,
  });
});

// 3. get a user orders (for admin if needed)
module.exports.getUserOrders = catchAsync(async (req, res, next) => {
  const ordersQueryManager = new DbQueryManager(Order.find({ userID: req.params.id }));
  const userOrders = await ordersQueryManager.all(req.query);

  const totalSize = await ordersQueryManager.totalCount(req.query, Order, {
    userID: req.params.id,
    deleted: { $ne: false },
  });

  res.status(200).json({
    status: "success",
    size: userOrders.length,
    totalSize,
    orders: userOrders,
  });
});

// 4. Post an order
module.exports.addOrder = catchAsync(async (req, res, next) => {
  // TODO
	// check that the restaurant's confirmStatus = "true"
});

// 5. Post a review
module.exports.addReview = catchAsync(async (req, res, next) => {
  // TODO
	// check that the restaurant's confirmStatus = "true"
});
