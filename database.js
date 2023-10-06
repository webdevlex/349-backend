var admin = require("firebase-admin");

function connectToDatabase() {
	const serviceAccount = {
		type: "service_account",
		project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
		private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
		private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
		client_email: process.env.CLIENT_EMAIL,
		client_id: process.env.CLIENT_ID,
		auth_uri: process.env.AUTH_URI,
		token_uri: process.env.TOKEN_URI,
		auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
		client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
		universe_domain: process.env.UNIVERSE_DOMAIN,
	};
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});

	console.log("Connected to firestore.");
}

module.exports = connectToDatabase;
