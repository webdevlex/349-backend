const mongoose = require("mongoose");

function connect() {
	const password = process.env.PASSWORD;
	const uri = `mongodb+srv://webdevlex:${password}@349-project.btinixd.mongodb.net/?retryWrites=true&w=majority`;
	try {
		mongoose.set("strictQuery", false);
		mongoose.connect(uri);
		console.log("Connected to MongoDB");
	} catch (err) {
		console.log(err);
	}
}
module.exports = connect;
