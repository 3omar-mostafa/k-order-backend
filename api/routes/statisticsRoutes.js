const express = require("express");
const authenticationController = require("./../../controllers/authenticationController");
const statisticsController = require("./../../controllers/statisticsController");

const router = express.Router();

// 1. get statistics (number of users / number of orders / number of approved restaurants)
router.get(
  "/",
  authenticationController.protect(),
  authenticationController.restrictTo("Admin"),
  statisticsController.getGeneralStatistics
);

module.exports = router;
