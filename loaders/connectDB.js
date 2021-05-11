const mongoose = require("mongoose");

const logger = require("../utils/logger");

// You have to configure a .env

const connectDB = async () => {
	const DB = process.env.DATABASE;
	try {
		await mongoose.connect(DB, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		logger.log('info', `✅ Database connected successfully ${process.env.NODE_ENV !== "production"?DB:''}`);
	} catch (err) {
		logger.log('error', `❌ Error connecting to database     ${err.toString()}`);
		process.exit(1);
	}
};

module.exports = connectDB;
