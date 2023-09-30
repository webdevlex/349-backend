require("dotenv").config();
const express = require("express");
const app = express();
const connectToDatabase = require("./database");
const cors = require("cors");

connectToDatabase();

app
	.use(express.json())
	.use(cors())
	.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
