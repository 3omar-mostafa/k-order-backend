const bcrypt = require("bcrypt");

// module.exports = function validatePassword(password, hash, salt) {
// 	var computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
// 	return hash === computedHash;
// };

module.exports = async function validatePassword(password, passwordHash) {
	const match = await bcrypt.compare(password, passwordHash);
	return match;
};
