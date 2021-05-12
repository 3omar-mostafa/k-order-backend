const mongoose = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/appError");

const reviewSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		restaurant: {
			type: mongoose.Schema.ObjectId,
			ref: "Restaurant",
		},
		rate: {
			type: Number,
			required: [true, "Rate must be specified."],
			min: 1,
			max: 5,
			validate: [
				{
					validator : Number.isInteger,
    			message   : '{VALUE} is not an integer value'
				}
			],
		},
		details: {
			type: String,
			required: [true, "Details must be specified."],
		}
	},
	{
		strict: "throw",
	}
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
