const express = require("express");
const router = express.Router();

var admin = require("firebase-admin");
const db = admin.firestore();
const Users = db.collection("users");

router.post("/signup", async (req, res) => {
	const dbQuery = Users;
	const snapshot = await dbQuery.where("email", "==", req.body.email).get();

	if (!snapshot.empty) {
		return res.status(409).json({ error: "Email already in use." });
	}

	const newUser = {
		email: req.body.email,
		password: req.body.password,
		bookmarks: [],
	};

	try {
		Users.add(newUser);
		return res.status(200).json(newUser);
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ error: "Server error." });
	}
});

router.post("/signin", async (req, res) => {
	try {
		const dbQuery = Users;
		const snapshot = await dbQuery.where("email", "==", req.body.email).get();

		if (snapshot.empty) {
			return res.status(404).json({ error: "User does not exist." });
		}

		let result = [];
		snapshot.forEach((doc) => {
			result.push(doc.data());
		});

		const user = result[0];
		if (user.password !== req.body.password) {
			return res.status(400).json({ error: "Invalid credentials." });
		}
		return res.status(200).json(user);
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ error: "Server error." });
	}
});

module.exports = router;
