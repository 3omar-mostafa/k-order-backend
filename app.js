//Include modules:-
//-----------------------------------------------------------------
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const passport = require("passport");
const path = require("path");
const compression = require("compression")


//Controllers:-
const errorController = require("./controllers/errorController");

//Routers:-
const authenticationRouter = require("./api/routes/authenticationRoutes");
const userRouter = require("./api/routes/userRoutes");
// const menuItemRouter = require("./api/routes/menuItemRoutes");
// const orderRouter = require("./api/routes/orderRoutes");
const restaurantRouter = require("./api/routes/restaurantRoutes");





//Globals:-
//-----------------------------------------------------------------
const app = express();

//Middlewares:-
//-----------------------------------------------------------------
//Limit requests ( 1] max: limits 1000 requests for each IP in one hour. | 2] windowMs: If the IP exceeds this limit then it would have to wait for an hour to pass. )
const limiter = rateLimit({
	max: 1000,
	windowMs: 60 * 60 * 1000,
	message: {
		status: "fail",
		message: "Too many requests from this IP. please try again in an hour.",
	},
});
app.use("/api", limiter);

//Adds security headers (Should be put at the top of the middleware stack) 
//[Causes problems on production ??!!]
//app.use(helmet());

// Prevent parameter pollution (prevents duplicate query string parameters & duplicate keys in urlencoded body requests)
// Add a second HPP middleware to apply the whitelist only to this route. e.g: app.use('/search', hpp({ whitelist: [ 'filter' ] }));
app.use(hpp());

//Middleware for debugging [Displays each incoming request in the console]
if (process.env.NODE_ENV === "development")
app.use(morgan("dev"));

//Reading data from the body of the request as json and converting it to javascript object into req.body
app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize({}));

//Data sanitization against XSS(cross-site scripting) attacks.
app.use(xss());

//Passport Configuration
require("./config/passportConfig")(passport);
app.use(passport.initialize()); //This line must be put if we are using sessions with passport so not necessary in our app but i'll put it anyways.

//Compress responses before sending it.
app.use(compression());


//For testing only
app.use((req, res, next) => {
	if(process.env.NODE_ENV !== "production"){
		res.setHeader("Access-Control-Allow-Origin", "*");
	}
	else{
		// res.setHeader("Access-Control-Allow-Origin", "http://www.k-order.com");
	}
	res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
	res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
	res.setHeader("Access-Control-Allow-Methods", "*");
	next();
});
//Serve static files ===> Frontend
const frontendPath = path.join(__dirname, process.env.FRONTEND_BUILD_LOCATION);
app.use(express.static(frontendPath));

const apiUrlBase = `${process.env.API_URL_PREFIX}/v${process.env.API_VERSION}`;

app.use(`${apiUrlBase}/authentication`, authenticationRouter);
// "/users/:id" --> gets a user
// "/users/:id/orders" --> gets user orders
app.use(`${apiUrlBase}/users`, userRouter);
// "/restaurants" --> gets all restaurants
// "/restaurants/:id" --> gets a restaurant
// "/restaurants/:id/menuItems" --> gets restaurant menu items
// "/restaurants/:id/reviews" --> gets restaurant reviews
app.use(`${apiUrlBase}/restaurants`, restaurantRouter); 
// might be for admins only to get all menuitems for all restaurants for statistics
// app.use(`${apiUrlBase}/menuItems`, menuItemRouter);
// might be for admins only to get all orders for all users for statistics
// app.use(`${apiUrlBase}/orders`, orderRouter);


//Setting Content-Security-Policy for images
app.use(function (req, res, next) {
	// res.setHeader("Content-Security-Policy", "img-src 'self' https://via.placeholder.com 	https://k-order.s3.us-east-2.amazonaws.com data:;");

	return next();
});
app.get(/.*/, function (req, res) {
	res.sendFile(`${frontendPath}/index.html`);
});

app.use(errorController);

module.exports = app;
