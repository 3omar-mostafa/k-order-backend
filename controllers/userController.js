const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");

const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

module.exports.me = catchAsync(async (req, res, next) => {
	res.status(200).json({ status: "success", user: req.user.toPublic() });
});

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
		orders: myOrders });
});

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
		orders: userOrders });
});
