const passport = require("passport");



// Models
const User = require("../models/UserModel");
const Admin = require("../models/AdminModel");
const Restaurant = require("../models/RestaurantModel");

// Utils classes
const AppError = require("../utils/appError");

// Utils services
const catchAsync = require("./../utils/catchAsync");
const generatePasswordHashAndSalt = require("../utils/generatePasswordHashAndSalt");
const verifyPassword = require("../utils/verifyPassword");
const signJwt = require("../utils/signJwt");




const adminSignupService = async (name, email, password) => {
	const passwordHash = await generatePasswordHashAndSalt(password);

	let newAdmin = new Admin({
		name,
		email,
		password: passwordHash
	});

	newAdmin = await newAdmin.save();
	return newAdmin;
}
module.exports.adminSignupService = adminSignupService;

module.exports.login = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		//Invalid email
		throw new AppError("Invalid email or password", 401);
	}

	const isValid = await verifyPassword(req.body.password, user.password);
	if (!isValid) {
		//Invalid password
		throw new AppError("Invalid email or password", 401);
	}

	//Valid email & pass
	const tokenObject = signJwt(user._id, 'User');
	const publicUser = user.toPublic();
	res.status(200).json({
		status: "success",
		token: tokenObject.token,
		expiresIn: tokenObject.expires,
		user: publicUser,
	});
});

module.exports.signup = catchAsync(async (req, res, next) => {
	const { name, phone, address, email, password } = req.body;

	User.validatePassword(password); //If there is an error it would be caught by catchAsync.
	const passwordHash = await generatePasswordHashAndSalt(password);

	let newUser = new User({
		name,
		phone,
		address,
		email,
		password: passwordHash
	});

	newUser = await newUser.save(); //If there is an error it would be caught by catchAsync.

	const tokenObject = signJwt(newUser._id, 'User');
	const publicUser = newUser.toPublic();
	res.status(200).json({
		status: "success",
		token: tokenObject.token,
		expiresIn: tokenObject.expires,
		user: publicUser,
	});
});

module.exports.adminLogin = catchAsync(async (req, res, next) => {
	const admin = await Admin.findOne({ email: req.body.email });
	if (!admin) {
		//Invalid email
		throw new AppError("Invalid email or password", 401);
	}

	const isValid = await verifyPassword(req.body.password, admin.password);
	if (!isValid) {
		//Invalid password
		throw new AppError("Invalid email or password", 401);
	}

	//Valid email & pass
	const tokenObject = signJwt(admin._id, 'Admin');
	const publicUser = admin.toPublic();
	res.status(200).json({
		status: "success",
		token: tokenObject.token,
		expiresIn: tokenObject.expires,
		user: publicUser,
	});
});

module.exports.adminSignup = catchAsync(async (req, res, next) => {
	const { name, email, password } = req.body;

	Admin.validatePassword(password); //If there is an error it would be caught by catchAsync.
	 const newAdmin = await adminSignupService(name, email, password)//If there is an error it would be caught by catchAsync.

	const tokenObject = signJwt(newAdmin._id, 'Admin');
	const publicUser = newAdmin.toPublic();
	res.status(200).json({
		status: "success",
		token: tokenObject.token,
		expiresIn: tokenObject.expires,
		user: publicUser,
	});
});

module.exports.getAdmins = catchAsync(async (req, res, next) => {
	const admins = await Admin.find();
	res.status(200).json({
		status: "success",
		admins
	});
});

module.exports.protect = () => {
	return passport.authenticate("jwt", { session: false });
};

module.exports.restaurantLogin = catchAsync(async (req, res, next) => {
	const restaurant = await Restaurant.findOne({ email: req.body.email });
	if (!restaurant) {
		//Invalid email
		throw new AppError("Invalid email or password", 401);
	}

	const isValid = await verifyPassword(req.body.password, restaurant.password);
	if (!isValid) {
		//Invalid password
		throw new AppError("Invalid email or password", 401);
	}

	if(restaurant.confirmStatus !== 'true'){
		throw new AppError("Your account is not approved yet. Please try again later.", 401);	
	}

	//Valid email & pass
	const tokenObject = signJwt(restaurant._id, 'Restaurant');
	const publicUser = restaurant.toPublic();
	res.status(200).json({
		status: "success",
		token: tokenObject.token,
		expiresIn: tokenObject.expires,
		restaurant: publicUser,
	});
});

module.exports.restaurantSignup = catchAsync(async (req, res, next) => {
	const { name, branches, email, password } = req.body;

	Restaurant.validatePassword(password); //If there is an error it would be caught by catchAsync.
	const passwordHash = await generatePasswordHashAndSalt(password);

	let newRestaurant = new Restaurant({
		name,
		branches,
		email,
		password: passwordHash,
		confirmStatus: "none"
	});

	newRestaurant = await newRestaurant.save(); //If there is an error it would be caught by catchAsync.

	res.status(200).json({
		status: "success",
		message: "Your account signup request is sent successfully. Please wait untill the admins review your information and approve it."
	});

	// const tokenObject = signJwt(newRestaurant._id, 'Restaurant');
	// const publicUser = newRestaurant.toPublic();
	// res.status(200).json({
	// 	status: "success",
	// 	token: tokenObject.token,
	// 	expiresIn: tokenObject.expires,
	// 	restaurant: publicUser,
	// });
});

module.exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		const myRole = req.user.constructor.modelName;
		
		if (!roles.includes(myRole))
			return next(
				new AppError(
					`You are unauthorized. This route is restricted to certain type of users.`,
					401
				)
			);
		else {
			return next();
		}
	};
};

// module.exports.authorize = (...authorities) => {
// 	return (req, res, next) => {

// 		const myAuthority = req.user.authority;
// 		if(!authorities.includes(myAuthority))
// 		return next(
// 			new AppError(
// 				`You are unauthorized. This route is restricted to certain type of users.`,
// 				401
// 			)
// 		);
// 		else {
// 			return next();
// 		}
// 	};
// };