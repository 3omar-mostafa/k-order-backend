const crypto = require("crypto");

module.exports = function validatePassword(password, hash, salt) {
	var computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
	return hash === computedHash;
};
