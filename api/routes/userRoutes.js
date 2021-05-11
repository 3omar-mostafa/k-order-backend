const express = require("express");
const authenticationController = require("./../../controllers/authenticationController");
const userController = require("./../../controllers/userController");

const router = express.Router();

router.get("/me", authenticationController.protect(), userController.me);

router.get(
	"/me/orders",
	authenticationController.protect(),
	authenticationController.restrictTo( "User"),
	userController.myOrders
);

router.get(
	"/:id/orders",
	authenticationController.protect(),
	authenticationController.restrictTo( "Admin"),
	userController.getUserOrders
);

module.exports = router;
