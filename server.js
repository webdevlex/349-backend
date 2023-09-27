require("dotenv").config();
const express = require("express");
const app = express();
const databaseConnect = require("./database");
const cors = require("cors");

databaseConnect();

app.use(express.json()).use(cors());

app.get("/", (req, res) => {
	res.send("hello world");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
