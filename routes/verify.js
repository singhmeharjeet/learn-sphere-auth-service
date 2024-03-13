const env = require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (app) =>
	app.get("/verify", async (req, res) => {
		const headers = req.headers;
		const token = headers.authorization.split(" ")[1];

		const user = jwt.verify(token, process.env.MY_SECRET);

		console.log("Request to verify token: ", req);

		res.cookie("token", token);
		if (!user) {
			return res.status(403).json({
				error: "invalid token",
			});
		}
		return res.json({
			success: true,
			message: "Logged in successfully",
			user,
		});
	});
