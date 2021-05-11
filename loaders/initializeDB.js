const Admin = require("../models/AdminModel");
const authenticationController = require("../controllers/authenticationController");

const logger = require("../utils/logger");


const initializeDB = async () => {
	logger.log('info', `⏳ Checking DB.`);
	const adminsCount = (await Admin.find()).length;
	if(adminsCount  <= 0)
	{
		logger.log('info', `✅ Admins are seeded --> count = ${adminsCount}`);
		await authenticationController.adminSignupService(process.env.SUPER_ADMIN_DEFAULT_NAME, process.env.SUPER_ADMIN_DEFAULT_EMAIL, process.env.SUPER_ADMIN_DEFAULT_PASSWORD, 'primary');
	}

	logger.log('info', `✅ Finished db seeding successfully`);
};
module.exports = initializeDB;

