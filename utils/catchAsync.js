//Handles Errors In ExpressJs Async Middlewares. It Throws The Errors To The Next Function Which Is Then Handled By ExpressJs.
module.exports = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch((err) => next(err));
	};
};
