const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");

const User = require("../models/RestaurantModel");

module.exports.me = catchAsync(async (req, res, next) => {
	res.status(200).json({ status: "success", user: req.user.toPublic() });
});
