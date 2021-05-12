const express = require("express");
const authenticationController = require("./../../controllers/authenticationController");
const restaurantController = require("./../../controllers/restaurantController");

const router = express.Router();

// 1. Get current restaurant info
router.get(
  "/me",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.me
);

// 2. Get specific restaurant info
router.get("/:id", restaurantController.getRestaurant);

// 3. Get a specific menu item of a specific restaurant
router.get("/:restaurant_id/menu-items/:menuItem_id", restaurantController.getMenuItem);

// 4. Get all menu items of a specific restaurant
router.get("/:id/menu-items/", restaurantController.getAllMenuItems);

// 5. Insert menu item
router.post(
  "/me/menu-items",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.addMenuItem
);

// 6. Update menu item (price / name / description)
router.patch(
  "/me/menu-items/:id",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.updateMenuItem
);

// 7. Delete menu item
router.delete(
  "/me/menu-items/:id",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.deleteMenuItem
);

// 8. get incoming orders
router.get(
  "/me/orders",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.getMyIncomingOrders
);

// 9. Set delivered status for a specific order
router.patch(
  "/me/orders/:id/delivered-status",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.changeDeliveredStatus
);

// 10. Get reviews of my restaurant
router.get(
  "/me/reviews",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.getMyIncomingReviews
);

// 11. Admin approve/reject restaurant (patch request)
router.patch(
  "/:id/confirm-status",
  authenticationController.protect(),
  authenticationController.restrictTo("Admin"),
  restaurantController.setConfirmStatus
);

// 12. get restaurants requests (get all restaurant documents with the field "confirmStatus" = "none" -- note that this field becomes "true" on approval and "false" on rejection)
router.get(
  "/requests",
  authenticationController.protect(),
  authenticationController.restrictTo("Admin"),
  restaurantController.getRestaurantsRequests
);

// 13. get all restaurants
router.get("/", restaurantController.getAllRestaurants);

module.exports = router;
