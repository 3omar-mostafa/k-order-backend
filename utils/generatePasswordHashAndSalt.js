const bcrypt = require("bcrypt");

module.exports = async function generatePasswordHashAndSalt(password) {
	// const salt = crypto.randomBytes(32).toString("hex");
	// const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
	const passwordHash = await bcrypt.hash(password, 1024); //Generates a string consists of a hash and a salt
	return passwordHash;
};
