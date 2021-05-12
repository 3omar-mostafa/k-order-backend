const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const validator = require("validator");


const orderSchema = new mongoose.Schema(
	{
		user: {
			//if signed up
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		date: {
			type: Date,
			required: [true, "Date must be specified."],
		},
		menuItems: [{
			type: mongoose.Schema.ObjectId,
			ref: "MenuItem",
			required: [true, "Menu items must be specified."],
		}],
		totalPrice: {
			type: Number,
			required: [true, "Total price must be specified."]
		},
		delivered: {
			type: Boolean,
			default: false
		},

	},
	{
		strict: "throw",
	}
);

//Plugins:-
//-----------------------------------------------------------------
orderSchema.plugin(idValidator, {
	message: "Bad ID value for {PATH}",
});

orderSchema.pre(/^find/, function (next) {
	this.find({
		deleted: {
			$ne: true,
		},
	});
	next();
});
orderSchema.pre(/^find/, function (next) {
	this.populate({ path: 'products.generalProduct', select: 'productName productName_Ar' });
	next();
});
orderSchema.pre("countDocuments", function (next) {
	this.find({
		deleted: {
			$ne: true,
		},
	});
	next();
});

//Returns a select options object for public user
orderSchema.statics.publicOrder = () => {
	return {
		deleted: 0,
		__v: 0,
	};
};

//Returns an object contains the public user info.
orderSchema.methods.toPublic = function () {
	const publicOrder = this.toObject({
		virtuals: true,
	});
	const fieldsToExclude = orderSchema.statics.publicOrder();

	Object.keys(publicOrder).forEach((el) => {
		if (fieldsToExclude[el] === 0) {
			delete publicOrder[el];
		}
	});
	return publicOrder;
};
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
