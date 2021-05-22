const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");
const requireConfirmed = require("../utils/requireConfirmedRestaurant"); // Requires that restaurant is confirmed by admin, if not throw an error


const Restaurant = require("../models/RestaurantModel");
const MenuItem = require("../models/MenuItemModel");
const Review = require("../models/ReviewModel");
const Order = require("../models/OrderModel");

// 1. Get current restaurant info
module.exports.me = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: "success", user: req.user.toPublic() });
});

// 2. [Admin] approve/reject restaurant (patch request)
module.exports.setConfirmStatus = catchAsync(async (req, res, next) => {
  let restaurantId = req.params.id;
  let restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new AppError("Invalid Restaurant Id", 401);
  }
  let confirmStatus = req.body.confirm_status;
  let acceptedValues = ["true", "false", "none"];
  if (!acceptedValues.includes(confirmStatus)) {
    throw new AppError(`Accepted values are : ${acceptedValues}`, 400);
  }
  restaurant.confirmStatus = confirmStatus;
  await restaurant.save();
  res.status(200).json({ status: "success" });
});

// 3. [Admin] Get restaurants requests (get all restaurant documents with the field "confirmStatus" = "none" -- note that this field becomes "true" on approval and "false" on rejection)
module.exports.getRestaurantsRequests = catchAsync(async (req, res, next) => {
  let queryManager = new DbQueryManager(Restaurant.find({ confirmStatus: "none" }));
  let restaurants = await queryManager.all(req.query);

  restaurants = restaurants.map((restaurant) => {
    return restaurant.toPublic();
  });

  const totalSize = await queryManager.totalCount(req.query, Restaurant, { confirmStatus: "none" });
  res.status(200).json({ status: "success", totalSize, restaurants });
});

// 4. Get specific restaurant info
module.exports.getRestaurant = catchAsync(async (req, res, next) => {
  let restaurantId = req.params.id;
  let restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new AppError("Invalid Restaurant Id", 401);
  }
  await requireConfirmed(restaurantId);
  res.status(200).json({ status: "success", restaurant: restaurant.toPublic() });
});

// 5. Get menu item
module.exports.getMenuItem = catchAsync(async (req, res, next) => {
  let restaurantId = req.params.restaurant_id;
  let menuItemId = req.params.menuItem_id;

  await requireConfirmed(restaurantId);
  let menuItem = await MenuItem.findOne({ _id: menuItemId, restaurant: restaurantId });

  if (!menuItem) {
    throw new AppError("Not Found", 404);
  }

  res.status(200).json({ status: "success", menu_item: menuItem });
});

// 6. Get menu item
module.exports.getAllMenuItems = catchAsync(async (req, res, next) => {
  let restaurantId = req.params.id;
  await requireConfirmed(restaurantId);

  let queryManager = new DbQueryManager(MenuItem.find({ restaurant: restaurantId }));
  let menuItems = await queryManager.all(req.query);
  const totalSize = await queryManager.totalCount(req.query, MenuItem, { restaurant: restaurantId });

  res.status(200).json({ status: "success", totalSize, menu_items: menuItems });
});

// 7. Insert menu item
module.exports.addMenuItem = catchAsync(async (req, res, next) => {
  const { name, image, description, ingredients, availableForSale, price } = req.body;
  let menuItem = new MenuItem({
    name,
    restaurant: req.user._id,
    image,
    description,
    ingredients,
    availableForSale,
    price
  });
  menuItem = await menuItem.save();
  res.status(201).json({ status: "created", menu_item: menuItem });
});

// 8. Update menu item (price / name / description)
module.exports.updateMenuItem = catchAsync(async (req, res, next) => {
  let menuItemId = req.params.id;
  let restaurantId = req.user._id;
  let menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    throw new AppError(`Menu Item with id ${menuItemId} is not found`, 404);

  }
  if (menuItem.restaurant.toString() !== restaurantId.toString()) {
    throw new AppError("You don't have permission to update this menu item", 403);
  }

  // Filter req.body to include only these properties
  const allowed = ["name", "image", "description", "ingredients", "availableForSale", "price"];
  const newMenuItem = Object.keys(req.body)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});


  await menuItem.updateOne(newMenuItem);

  res.status(200).json({ status: "updated" });
});

// 9. Delete menu item
module.exports.deleteMenuItem = catchAsync(async (req, res, next) => {
  let menuItemId = req.params.id;
  let restaurantId = req.user._id;
  let menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    throw new AppError(`Menu Item with id ${menuItemId} is not found`, 404);

  }
  if (menuItem.restaurant.toString() !== restaurantId.toString()) {
    throw new AppError("You don't have permission to delete this menu item", 403);
  }

  await MenuItem.deleteOne({ _id: menuItemId, restaurant: restaurantId });
  res.status(200).json({ status: "deleted" });
});

// 10. get incoming orders
module.exports.getMyIncomingOrders = catchAsync(async (req, res, next) => {
  // TODO
});

// 11. Set delivered status for a specific order
module.exports.changeDeliveredStatus = catchAsync(async (req, res, next) => {
  // TODO
  // You need to check that the order belongs to the restaurant sending this request
});

// 12. Get reviews of my restaurant
module.exports.getMyIncomingReviews = catchAsync(async (req, res, next) => {
  // TODO
});

// 13. get all restaurants
module.exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  let queryManager = new DbQueryManager(Restaurant.find({ confirmStatus: "true" }));
  let restaurants = await queryManager.all(req.query);

  restaurants = restaurants.map((restaurant) => {
    return restaurant.toPublic();
  });

  const totalSize = await queryManager.totalCount(req.query, Restaurant, { confirmStatus: "true" });
  res.status(200).json({ status: "success", totalSize, restaurants });
});
