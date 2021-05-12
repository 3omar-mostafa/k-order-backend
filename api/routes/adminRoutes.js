const express = require("express");
const authenticationController = require("./../../controllers/authenticationController");
const adminController = require("./../../controllers/adminController");

const router = express.Router();

// 1. Get my info
router.get(
  "/me",
  authenticationController.protect(),
  authenticationController.restrictTo("Admin"),
  adminController.me
);

module.exports = router;
