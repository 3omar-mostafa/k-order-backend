const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");

const Admin = require("../models/AdminModel");
const Order = require("../models/OrderModel");
const MenuItem = require("../models/MenuItemModel");
const Restaurant = require("../models/RestaurantModel");



// 1. get statistics (number of users / number of orders / number of approved restaurants)
module.exports.getGeneralStatistics = catchAsync(async (req, res, next) => {
	// TODO
	// check that the restaurants' confirmStatus = "true"
});