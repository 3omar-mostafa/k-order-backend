const express = require("express");
const authenticationController = require("./../../controllers/authenticationController");
const userController = require("./../../controllers/userController");

const router = express.Router();

// 1. Get my info
router.get(
  "/me",
  authenticationController.protect(),
  authenticationController.restrictTo("User"),
  userController.me
);

// 2. get my orders
router.get(
  "/me/orders",
  authenticationController.protect(),
  authenticationController.restrictTo("User"),
  userController.myOrders
);

// 3. get a specific user orders (for admin if needed)
router.get(
  "/:id/orders",
  authenticationController.protect(),
  authenticationController.restrictTo("Admin"),
  userController.getUserOrders
);

// 4. Post an order
router.post(
  "/me/orders",
  authenticationController.protect(),
  authenticationController.restrictTo("User"),
  userController.addOrder
);

// 5. Get all my reviews
router.get(
  "/me/reviews",
  authenticationController.protect(),
  authenticationController.restrictTo("User"),
  userController.getAllReviews
);

// 6. Get specific review
router.get(
  "/me/reviews/:id",
  authenticationController.protect(),
  authenticationController.restrictTo("User"),
  userController.getReview
);

// 7. Create a review
router.post(
  "/me/reviews",
  authenticationController.protect(),
  authenticationController.restrictTo("User"),
  userController.addReview
);

// 8. Update a review
router.patch(
  "/me/reviews/:id",
  authenticationController.protect(),
  authenticationController.restrictTo("User"),
  userController.updateReview
);

// 9. Delete a review
router.delete(
  "/me/reviews/:id",
  authenticationController.protect(),
  authenticationController.restrictTo("User"),
  userController.deleteReview
);

module.exports = router;
