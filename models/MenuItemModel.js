const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "The SKU code must be specified."],
		},
		restaurant: {
			type: mongoose.Schema.ObjectId,
			required: [true, "Restaurant must be specified."],
			ref: "Restaurant",
		},
		image: {
			type: String,
			// required: [true, "Product image url must be specified."], //Because the product will be created first then if the product is created successfully, the image will be uploaded then the product image will be updated
		},
		description: {
			type: String
		},
		dateOfRelease: {
			type: Date,
			required: [true, "Date of release must be specified."],
		},
		availableForSale: {
			type: Boolean,
			default: true,
		},
		SalePercentage: {
			type: Number,
		},
	},
	{
		strict: "throw",
	}
);

productSchema.pre(/^find/, function (next) {
	this.find({
		availableForSale: {
			$ne: false,
		},
	});
	next();
});

productSchema.pre("count", function (next) {
	this.find({
		deleted: {
			$ne: true,
		},
	});
	next();
});

// productSchema.pre("findOne", function (next) {
// 	this.find({
// 		availableForSale: {
// 			$ne: false,
// 		},
// 	});
// 	next();
// });
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
