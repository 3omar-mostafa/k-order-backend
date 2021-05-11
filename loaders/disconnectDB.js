const mongoose = require("mongoose");
const logger = require("../utils/logger");

const disconnectDB = async () => {
	try {
		await mongoose.disconnect();
		logger.log('info', "✅ database disconnected successfully.");
	} catch (err) {
		logger.log('error', "❌ Failed during disconnecting database");
	}
};

module.exports = disconnectDB;
