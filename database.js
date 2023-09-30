var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

function connectToDatabase() {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});

	console.log("Connected to firestore.");
}

module.exports = connectToDatabase;
