const Restaurant = require("../models/RestaurantModel");
const AppError = require("../utils/appError");

// Requires that restaurant is confirmed by admin, if not throw an error
module.exports = async (restaurantId) => {
  let restaurant = await Restaurant.findById(restaurantId);
  if (restaurant.confirmStatus !== "true") {
    throw new AppError(`Restaurant with id ${restaurantId} is not confirmed`, 400);
  }
};
