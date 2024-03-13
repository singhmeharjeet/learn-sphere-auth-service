const env = require("dotenv").config();
const jwt = require("jsonwebtoken");

const { getUser } = require("../functions.js");

module.exports = (app) =>
	app.post("/login", async (req, res) => {
		const { username, password } = req.body;

		const DB_user = await getUser(username);

		if (!DB_user) {
			return res.status(403).json({
				success: false,
				message: "User not found.",
			});
		}

		if (DB_user.password !== password) {
			return res.status(403).json({
				success: false,
				message: "Invalid Credentials.",
			});
		}

		delete DB_user.password;

		const token = jwt.sign(DB_user, process.env.MY_SECRET, {
			expiresIn: "1h",
		});

		res.cookie("token", token);

		return res.json({
			success: true,
			message: "Logged in successfully",
			user: DB_user,
		});
	});
