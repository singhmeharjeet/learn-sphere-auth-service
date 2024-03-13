const env = require("dotenv").config();

const jwt = require("jsonwebtoken");

const { createUser } = require("../db");

module.exports = (app) =>
	app.post("/signup", async (req, res) => {
		const { username, password, role } = req.body;

		const user = await createUser(username, password, role);

		const token = jwt.sign(user, process.env.MY_SECRET, {
			expiresIn: "1h",
		});

		res.cookie("token", token);

		return res.json({
			success: true,
			message: "Signed up successfully",
			user,
		});
	});
