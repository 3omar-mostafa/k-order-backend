const express = require("express");
const authenticationController = require("./../../controllers/authenticationController");
const restaurantController = require("./../../controllers/restaurantController");

const router = express.Router();

router.get("/me", authenticationController.protect(), restaurantController.me);

module.exports = router;
