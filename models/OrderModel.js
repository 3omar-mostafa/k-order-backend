const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const orderedProductObject = require("./objects/orderedProductObject");
const validator = require("validator");


const orderSchema = new mongoose.Schema(
	{
		code: {
			type: Number,
			unique: [true, "Order code must be unique."],
			required: [true, "Order code must be specified."],
		},
		userID: {
			//if signed up
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		customerName: {
			type: String,
			required: [true, "Customer name must be specified,"],
		},
		customerPhoneNumbers: {
			type: [String],
			required: [true, "Customer phone numbers array must be specified."],
			validate: [
				{
					validator: (v) => v.length >= 1 && v.length <= 3,
					message: `Phone numbers array must contain at least 1 phone number and at most 3 phone numbers`,
				},
				{
					validator: (v) => new Set(v).size === v.length,
					message: `Phone numbers must not contain duplicates`,
				},
				{
					validator: (v) => v.every((val) => /^(01)[0-9]{9}$/.test(val)),
					message: `Phone numbers are in the wrong format`,
				},
			],
		},
		customerAddress: {
			type: String,
			required: [true, "Customer address must be specified."],
		},
		date: {
			type: Date,
			required: [true, "Date must be specified."],
		},
		products: {
			type: [orderedProductObject],
			required: [true, "Products must be specified."],
		},
		shippingMethod: {
			type: String,
			required: [true, "Shipping method field must be specified."],
			validate: {
				validator: (v) => Object.keys(SHIPPING_FEES).includes(v),
				message: `Shipping method must be one of ${Object.keys(SHIPPING_FEES)}`,
			}
		},
		shippingFees: {
			type: Number,
			required: [true, "Shipping fees field must be specified."]
		},
		customerEmail: {
			type: String,
			trim: true,
			validate: [validator.isEmail, "Email is invalid."]
		},
		// For Admins
		seen: {
			type: Boolean,
			default: false,
		},
		deliveredStatus: {
			type: String,
			enum: ["delivered", "undelivered", "in transit", "rejected"],
			default: false,
		},
		designerDone: {
			type: Boolean,
			default: false
		},
		deleted: {
			type: Boolean,
			default: false,
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
