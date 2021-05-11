const AppError = require("./../utils/appError");
const logger = require("../utils/logger");

const handleCastErrorDB = (err) => {
	const message = `invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
	const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value ${value} please use another value`;
	return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};
const handleJWTError = () => {
	return new AppError(`Invalid token please login again`, 401);
};
const handleJWTExpiredError = () => {
	return new AppError(`Your token has expired. Please login again`, 401);
};
const handleBodyParserError = (err) => {
	return new AppError(`The Body Content is Invalid:   ${err.message}`, 400);
};
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err, req, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		const user = (req.user)?req.user.toObject:{};
		const request = {
			method: req.method,
			url: req.url,
			body: {
				...req.body
			},
			params: {
				...req.params
			},
			query: {
				...req.query
			},
			user: {
				...user
			},
			headers: {
				...req.headers
			},
			rawHeaders: {
				...req.rawHeaders
			},

		}
		logger.log('error', "This is an unhandled error", {
			request,
			err
		});

		res.status(500).json({
			status: "error",
			message: err.message || "Error. Sorry you can't proceed.",
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = {
			...err,
		};
		error.message = err.message;
		error.name = err.name;

		if (error.name === "CastError") error = handleCastErrorDB(error);
		else if (error.code === 11000) error = handleDuplicateFields(error);
		else if (error.name === "ValidationError") error = handleValidationErrorDB(error);
		else if (error.name === "JsonWebTokenError") error = handleJWTError();
		else if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
		else if (error.type === "entity.parse.failed" && error.message.includes("in JSON at position"))
			error = handleBodyParserError(error);
		// else if(error.errors)
		// {
		//     error.errors.model
		// }
		sendErrorProd(error, req, res);
	}
};
