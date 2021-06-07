const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const validator = require("validator");

const User = require("./UserModel");

const orderSchema = new mongoose.Schema(
	{
		user: {
			//if signed up
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		restaurant: {
			type: mongoose.Schema.ObjectId,
			ref: "Restaurant",
		},
		date: {
			type: Date,
			required: [true, "Date must be specified."],
			default: Date.now()
		},
		menuItems: [{
			quantity: {
				type: Number,
				default: 1,
				min: 1
			},
			menuItem: {
				type: mongoose.Schema.ObjectId,
				ref: "Product",
				required: [true, "Menu items must be specified."],
			},
			_id: false,
			id: false
		}],
		totalPrice: {
			type: Number,
			required: [true, "Total price must be specified."]
		},
		delivered: {
			type: Boolean,
			required: [true, "Delivered status is required"],
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

	publicOrder.user = new User(publicOrder.user).toPublic();
	return publicOrder;
};
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
