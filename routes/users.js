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
		playlist: [],
		playlistIds: [],
	};

	try {
		const docRef = await Users.add(newUser);
		return res.status(200).json({ ...newUser, user_id: docRef.id });
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
		let user_id;
		snapshot.forEach((doc) => {
			result.push(doc.data());
			user_id = doc.id;
		});

		const user = result[0];
		if (user.password !== req.body.password) {
			return res.status(400).json({ error: "Invalid credentials." });
		}
		return res.status(200).json({ ...user, user_id });
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ error: "Server error." });
	}
});

router.post("/add-movie-to-playlist", async (req, res) => {
	try {
		const { movie, user_id } = req.body;

		// Update the user document with the new movie
		const userRef = db.collection("users").doc(user_id);
		await userRef.update({
			playlist: admin.firestore.FieldValue.arrayUnion(movie),
			playlistIds: admin.firestore.FieldValue.arrayUnion(movie.id),
		});

		// Retrieve the updated user document
		const userDoc = await userRef.get();
		const updatedUser = userDoc.data();

		return res.status(200).json({ ...updatedUser, user_id });
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: "Server error." });
	}
});

router.patch("/remove-movie-from-playlist", async (req, res) => {
	try {
		const { movie_id, user_id } = req.body;

		// Get the user document
		const userRef = db.collection("users").doc(user_id);
		const userDoc = await userRef.get();
		const user = userDoc.data();

		// Filter the playlist and playlistIds arrays
		const filteredPlaylist = user.playlist.filter(
			(movie) => movie.id !== movie_id
		);
		const filteredIds = user.playlistIds.filter((id) => id !== movie_id);

		// Update the user document with the filtered arrays
		await userRef.update({
			playlist: filteredPlaylist,
			playlistIds: filteredIds,
		});

		// Retrieve the updated user document
		const updatedUserDoc = await userRef.get();
		const updatedUser = updatedUserDoc.data();

		return res.status(200).json({ ...updatedUser, user_id });
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: "Server error." });
	}
});

module.exports = router;
