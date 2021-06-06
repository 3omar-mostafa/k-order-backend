const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");
const requireConfirmedRestaurant = require("../utils/requireConfirmedRestaurant"); // Requires that restaurant is confirmed by admin, if not throw an error
const filterAllowedProperties = require("../utils/filterAllowedProperties"); // Filter object to include only allowed properties

const User = require("../models/UserModel");
const MenuItem = require("../models/MenuItemModel");
const Order = require("../models/OrderModel");
const Review = require("../models/ReviewModel");

// 1. Get my info
module.exports.me = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: "success", user: req.user.toPublic() });
});

// 2. get my orders
module.exports.myOrders = catchAsync(async (req, res, next) => {
  const ordersQueryManager = new DbQueryManager(Order.find({ user: req.user._id }));
  let myOrders = await ordersQueryManager.all(req.query);
  const totalSize = await ordersQueryManager.totalCount(req.query, Order, { user: req.user._id });

  myOrders = myOrders.map((order) => {
    return order.toPublic();
  });

  res.status(200).json({
    status: "success",
    totalSize,
    orders: myOrders,
  });
});

// 3. get a user orders (for admin if needed)
module.exports.getUserOrders = catchAsync(async (req, res, next) => {
  const ordersQueryManager = new DbQueryManager(Order.find({ user: req.params.id }));
  let userOrders = await ordersQueryManager.all(req.query);

  const totalSize = await ordersQueryManager.totalCount(req.query, Order, { user: req.params.id });

  userOrders = userOrders.map((order) => {
    return order.toPublic();
  });

  res.status(200).json({
    status: "success",
    totalSize,
    orders: userOrders,
  });
});

// 4. Post an order
module.exports.addOrder = catchAsync(async (req, res, next) => {
  let userId = req.user._id;
  let quantities = req.body.map(obj => obj.quantity);
  let menuItemIds = req.body.map(obj => obj.menuItem);
  let menuItems = await MenuItem.find({ '_id': { $in: menuItemIds } });

  let restaurantIds = new Set();
  for (let menuItem of menuItems) {
    restaurantIds.add(menuItem.restaurant.toString());
  }

  if (restaurantIds.size > 1) {
    throw new AppError("Order Items must be of the same restaurant", 400);
  }

  let restaurantId = menuItems[0].restaurant;
  await requireConfirmedRestaurant(restaurantId);

  let totalPrice = 0;
  for (let i = 0; i < menuItems.length; i++) {
    totalPrice += menuItems[i].price * quantities[i];
  }

  let order = new Order({
    user: userId,
    restaurant: restaurantId,
    menuItems: req.body,
    totalPrice
  });

  order = await order.save();

  // populate menu items objects
  order.menuItems = quantities.map(function (q, i) {
    return { quantity: q, menuItem: menuItems[i] }
  });
  
  res.status(201).json({ status: "created", order: order.toPublic() });
});

// 5. Get all my reviews
module.exports.getAllReviews = catchAsync(async (req, res, next) => {
  let userId = req.user._id;
  let queryManager = new DbQueryManager(Review.find({ user: userId }));
  let reviews = await queryManager.all(req.query);

  const totalSize = await queryManager.totalCount(req.query, Review, { user: userId });
  res.status(200).json({ status: "success", totalSize, reviews });
});

// 6. Get specific review
module.exports.getReview = catchAsync(async (req, res, next) => {
  let userId = req.user._id;
  let reviewId = req.params.id;

  let review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError(`Review with id ${reviewId} is not found`, 404);
  }

  if (review.user.toString() !== userId.toString()) {
    throw new AppError("You don't have permission to access this review", 403);
  }

  res.status(200).json({ status: "success", review });
});

// 7. Create a review
module.exports.addReview = catchAsync(async (req, res, next) => {
  let userId = req.user._id;
  let { restaurantId, rate, details } = req.body;

  await requireConfirmedRestaurant(restaurantId);

  let review = new Review({
    user: userId,
    restaurant: restaurantId,
    rate,
    details
  });

  try {
    review = await review.save();
  } catch (e) {
    if (e.message.search("duplicate key error") !== -1) {
      throw new AppError("You have already submitted a review for this restaurant", 400);
    }
    throw e;
  }
  res.status(201).json({ status: "created", review });
});

// 8. Update a review
module.exports.updateReview = catchAsync(async (req, res, next) => {
  let userId = req.user._id;
  let reviewId = req.params.id;

  let review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError(`Review with id ${reviewId} is not found`, 404);
  }

  if (review.user.toString() !== userId.toString()) {
    throw new AppError("You don't have permission to update this review", 403);
  }

  const newReview = filterAllowedProperties(req.body, ["rate", "details"]);

  await Review.findByIdAndUpdate(reviewId, newReview);

  res.status(200).json({ status: "updated" });
});

// 9. Delete a review
module.exports.deleteReview = catchAsync(async (req, res, next) => {
  let userId = req.user._id;
  let reviewId = req.params.id;

  let review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError(`Review with id ${reviewId} is not found`, 404);
  }

  if (review.user.toString() !== userId.toString()) {
    throw new AppError("You don't have permission to delete this review", 403);
  }

  await review.delete();
  res.status(200).json({ status: "deleted" });
});
