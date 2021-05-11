/**
 * This module will generate a public and private keys
 *
 * VIP !!: Private key must not be exposed to public.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function generatePublicAndPrivateKeys() {
	// Generates an object where the keys are stored in properties `privateKey` and `publicKey`
	const keys = crypto.generateKeyPairSync("rsa", {
		modulusLength: 4096, // bits - standard for RSA keys
		publicKeyEncoding: {
			type: "pkcs1", // "Public Key Cryptography Standards 1"
			format: "pem", // Most common format
		},
		privateKeyEncoding: {
			type: "pkcs1", // "Public Key Cryptography Standards 1"
			format: "pem", // Most common format
		},
	});

	let keyPath = path.join(__dirname, "../config/jwt-keys/publicKey.pem");

	// Create the public key file
	fs.writeFileSync(keyPath, keys.publicKey);

	keyPath = path.join(__dirname, "../config/jwt-keys/privateKey.pem");

	// Create the private key file
	fs.writeFileSync(keyPath, keys.privateKey);
}

generatePublicAndPrivateKeys();
