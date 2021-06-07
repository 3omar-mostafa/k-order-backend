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

// 2. [Admin] delete restaurant
router.delete(
  "/:id/",
  authenticationController.protect(),
  authenticationController.restrictTo("Admin"),
  restaurantController.deleteRestaurant
);

// 3. [Admin] delete multiple restaurants
router.delete(
  "/",
  authenticationController.protect(),
  authenticationController.restrictTo("Admin"),
  restaurantController.deleteMultipleRestaurants
);

// 4. [Admin] approve/reject restaurant (patch request)
router.patch(
  "/:id/confirm-status",
  authenticationController.protect(),
  authenticationController.restrictTo("Admin"),
  restaurantController.setConfirmStatus
);

// 5. [Admin] approve/reject multiple restaurants (patch request)
router.patch(
  "/confirm-status",
  authenticationController.protect(),
  authenticationController.restrictTo("Admin"),
  restaurantController.setConfirmStatusMultiple
);

// 6. [Admin] Get restaurants requests (get all restaurant documents with the field "confirmStatus" = "none" -- note that this field becomes "true" on approval and "false" on rejection)
// NOTE: This route must be before /:id route because it considers 'requests' as an id
router.get(
  "/requests",
  authenticationController.protect(),
  authenticationController.restrictTo("Admin"),
  restaurantController.getRestaurantsRequests
);

// 7. Get specific restaurant info
router.get("/:id", restaurantController.getRestaurant);

// 8. Get a specific menu item of a me
router.get("/me/menu-items/:menuItem_id",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.getMenuItemOfMe);

// 9. Get a specific menu item of a specific restaurant
router.get("/:restaurant_id/menu-items/:menuItem_id", restaurantController.getMenuItem);

// 10. Get all menu items of a me
router.get("/me/menu-items/",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.getAllMenuItemsOfMe);

// 11. Get all menu items of a specific restaurant
router.get("/:id/menu-items/", restaurantController.getAllMenuItems);

// 12. Insert menu item
router.post(
  "/me/menu-items",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.addMenuItem
);

// 13. Update menu item (price / name / description)
router.patch(
  "/me/menu-items/:id",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.updateMenuItem
);

// 14. Delete menu item
router.delete(
  "/me/menu-items/:id",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.deleteMenuItem
);

// 15. get incoming orders
router.get(
  "/me/orders",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.getMyIncomingOrders
);

// 16. Set delivered status for a specific order
router.patch(
  "/me/orders/:id/delivered-status",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.changeDeliveredStatus
);

// 17. Get reviews of my restaurant
router.get(
  "/me/reviews",
  authenticationController.protect(),
  authenticationController.restrictTo("Restaurant"),
  restaurantController.getMyIncomingReviews
);

// 18. Get specific restaurant reviews
router.get("/:id/reviews", restaurantController.getRestaurantReviews);

// 19. get all restaurants
router.get("/", restaurantController.getAllRestaurants);

module.exports = router;
