const env = require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (app) =>
	app.get("/verify", (req, res) => {
		console.log("auth/verify endpoint hit");

		let token = "";
		try {
			const headers = req.headers;
			console.log("headers: ", headers);
			const cookie = req.headers.cookie;
			if (!cookie) {
				return res.status(403).json({
					success: false,
					message: "No JWT token provided",
				});
			}

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
			res.cookie("token", token);
			if (!user) {
				return res.status(403).json({
					success: false,
					message: "invalid token",
				});
			}
			const reply = {
				success: true,
				message: "Verified successfully",
				user,
			};
			console.log("Replying with: ", reply);
			return res.json(reply);
		} catch (err) {
			console.log("Error: ", err);

			return res.status(403).json({
				success: false,
				message: "Token expired",
			});
		}
	});
