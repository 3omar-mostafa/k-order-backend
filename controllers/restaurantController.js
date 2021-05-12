const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");

const Restaurant = require("../models/RestaurantModel");
const MenuItem = require("../models/MenuItemModel");
const Review = require("../models/ReviewModel");
const Order = require("../models/OrderModel");

// 1. Get current restaurant info
module.exports.me = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: "success", user: req.user.toPublic() });
});

// 2. Get specific restaurant info
module.exports.getRestaurant = catchAsync(async (req, res, next) => {
  // TODO
});

// 3. Get menu item
module.exports.getMenuItem = catchAsync(async (req, res, next) => {
  // TODO
	// check that the restaurant's confirmStatus = "true"
});

// 4. Get menu item
module.exports.getAllMenuItems = catchAsync(async (req, res, next) => {
  // TODO
	// check that the restaurant's confirmStatus = "true"
});

// 5. Insert menu item
module.exports.addMenuItem = catchAsync(async (req, res, next) => {
  // TODO
});

// 6. Update menu item (price / name / description)
module.exports.updateMenuItem = catchAsync(async (req, res, next) => {
  // You need to check that the menu item belongs to the restaurant sending this request
  // TODO
});

// 7. Delete menu item
module.exports.deleteMenuItem = catchAsync(async (req, res, next) => {
  // TODO
  // You need to check that the menu item belongs to the restaurant sending this request
});

// 8. get incoming orders
module.exports.getMyIncomingOrders = catchAsync(async (req, res, next) => {
  // TODO
});

// 9. Set delivered status for a specific order
module.exports.changeDeliveredStatus = catchAsync(async (req, res, next) => {
  // TODO
  // You need to check that the order belongs to the restaurant sending this request
});

// 10. Get reviews of my restaurant
module.exports.getMyIncomingReviews = catchAsync(async (req, res, next) => {
  // TODO
});

// 11. Admin approve/reject restaurant (patch request)
module.exports.setConfirmStatus = catchAsync(async (req, res, next) => {
  // TODO
});

// 12. get restaurants requests (get all restaurant documents with the field "confirmStatus" = "none" -- note that this field becomes "true" on approval and "false" on rejection)
module.exports.getRestaurantsRequests = catchAsync(async (req, res, next) => {
  // TODO
});

// 13. get all restaurants
module.exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  // TODO
});
