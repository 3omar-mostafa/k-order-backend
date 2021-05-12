const express = require("express");
const authenticationController = require("./../../controllers/authenticationController");

const router = express.Router();

router.post("/signup", authenticationController.signup);
router.post("/login", authenticationController.login);
router.post("/restaurant-signup", authenticationController.restaurantSignup);
router.post("/restaurant-login", authenticationController.restaurantLogin);
router.post("/admin-signup", authenticationController.protect(), authenticationController.restrictTo("Admin"), authenticationController.adminSignup);
router.post("/admin-login", authenticationController.adminLogin);

module.exports = router;