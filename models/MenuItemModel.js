const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "The menu item name must be specified."],
		},
		restaurant: {
			type: mongoose.Schema.ObjectId,
			required: [true, "Restaurant must be specified."],
			ref: "Restaurant",
		},
		image: {
			type: String,
			// required: [true, "image url must be specified."], //Because the menu item will be created first then if the menu item is created successfully, the image will be uploaded then the menu item image will be updated
		},
		description: {
			type: String,
			required: [true, "Description must be specified."]
		},
		ingredients: {
			type: [String],
			required: [true, "Array of ingredients must be specified."]
		},
		price: {
			type: Number,
			required: [true, "Price must be specified."]
		},
		availableForSale: {
			type: Boolean,
			default: true,
		}
	},
	{
		strict: "throw",
	}
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
