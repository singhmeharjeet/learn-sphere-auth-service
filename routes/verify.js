const env = require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (app) =>
	app.get("/verify", (req, res) => {
		const cookie = req?.headers?.cookie;
		if (!cookie) {
			return res.status(403).json({
				success: false,
				message: "No JWT token provided",
			});
		}

		let token = "";
		try {
			token = cookie.split("=")[1];

			if (!token) {
				return res.status(403).json({
					success: false,
					message: "No JWT token provided",
				});
			}
		} catch (error) {
			return res.status(403).json({
				success: false,
				message: "Some Error occurded while parsing the token",
			});
		}

		try {
			const user = jwt.verify(token, process.env.MY_SECRET);
			if (!user) {
				return res.status(403).json({
					success: false,
					message: "invalid token",
				});
			}
			return res.json({
				success: true,
				message: "Verified successfully",
				user,
			});
		} catch (err) {
			return res.status(403).json({
				success: false,
				message: "Token expired or Token is invalid",
			});
		}
	});
