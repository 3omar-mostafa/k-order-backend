const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const generatePasswordHashAndSalt = require("../utils/generatePasswordHashAndSalt");
const verifyPassword = require("../utils/verifyPassword");
const signJwt = require("../utils/signJwt");
const User = require("../models/UserModel");
const Admin = require("../models/AdminModel");

const passport = require("passport");

const adminSignupService = async (name, email, password, authority) => {
	const passwordObject = generatePasswordHashAndSalt(password);
	const passwordSalt = passwordObject.salt;
	const passwordHash = passwordObject.hash;

	let newAdmin = new Admin({
		name,
		email,
		authority,
		passwordHash,
		passwordSalt,
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

	const isValid = verifyPassword(req.body.password, user.passwordHash, user.passwordSalt);
	if (!isValid) {
		//Invalid password
		throw new AppError("Invalid email or password", 401);
	}

	//Valid email & pass
	const tokenObject = signJwt(user._id, false);
	const publicUser = user.toPublic();
	res.status(200).json({
		status: "success",
		token: tokenObject.token,
		expiresIn: tokenObject.expires,
		user: publicUser,
	});
});

module.exports.signup = catchAsync(async (req, res, next) => {
	const { name, phoneNumbers, addresses, email, password, isSocialAdmin } = req.body;

	User.validatePassword(password); //If there is an error it would be caught by catchAsync.
	const passwordObject = generatePasswordHashAndSalt(password);
	const passwordSalt = passwordObject.salt;
	const passwordHash = passwordObject.hash;

	let newUser = new User({
		name,
		phoneNumbers,
		addresses,
		email,
		passwordHash,
		passwordSalt,
		created_at: new Date(),
		passwordLastChangedAt: new Date(),
		isSocialAdmin
	});

	newUser = await newUser.save(); //If there is an error it would be caught by catchAsync.

	const tokenObject = signJwt(newUser._id, false);
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

	const isValid = verifyPassword(req.body.password, admin.passwordHash, admin.passwordSalt);
	if (!isValid) {
		//Invalid password
		throw new AppError("Invalid email or password", 401);
	}

	//Valid email & pass
	const tokenObject = signJwt(admin._id, true);
	const publicUser = admin.toPublic();
	res.status(200).json({
		status: "success",
		token: tokenObject.token,
		expiresIn: tokenObject.expires,
		user: publicUser,
	});
});

module.exports.adminSignup = catchAsync(async (req, res, next) => {
	const { name, email, password, authority } = req.body;

	Admin.validatePassword(password); //If there is an error it would be caught by catchAsync.
	 const newAdmin = await adminSignupService(name, email, password, authority)//If there is an error it would be caught by catchAsync.

	const tokenObject = signJwt(newAdmin._id, true);
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