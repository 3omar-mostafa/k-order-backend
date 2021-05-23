const mongoose = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/appError");
const Restaurant = require("./RestaurantModel");

let reviewSchema = new mongoose.Schema(
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

// User can review a restaurant only once, this ensures uniqueness of this combination
reviewSchema.index({ "user": 1, "restaurant": 1 }, { "unique": true });

let restaurantAverageRating = async (restaurantId) => {
	return (await Review.aggregate([{ $match: { restaurant: restaurantId } }, { $unwind: "$restaurant" },
		{ $group: { _id: "$restaurant", average: { $avg: "$rate" } } }]))[0].average;
};

// Whenever a review is modified, we update the corresponding restaurant rating
let modifyingMethods = ['save', 'findOneAndUpdate', 'remove', 'deleteOne', 'findOneAndDelete'];
reviewSchema.post(modifyingMethods, { query: true, document: true }, async (review) => {
	console.log(review);
	let restaurantId = review.restaurant;
	let rating = await restaurantAverageRating(restaurantId);
	await Restaurant.findByIdAndUpdate(restaurantId, { rating });
});


const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
