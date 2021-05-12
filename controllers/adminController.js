const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");

// const Admin = require("../models/AdminModel");
// const Order = require("../models/OrderModel");
// const Restaurant = require("../models/RestaurantModel");



// 1. Get my info
module.exports.me = catchAsync(async (req, res, next) => {
	res.status(200).json({ status: "success", user: req.user.toPublic() });
});