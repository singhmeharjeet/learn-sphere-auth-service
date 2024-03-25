const env = require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (app) => {
	app.get("/verify", (req, res) => {
		/**
		 * Return type:
		 *
		 * {
		 * 		success: boolean,
		 * 		message: string,
		 * 		user? : {
		 * 			username: string,
		 * 				role: string
		 * 		}
		 * }
		 */

		let cookie = null;

		// Check in the authorization header
		if (!cookie) {
			cookie = req?.headers?.authorization;
			cookie && (cookie = cookie.split("Bearer ")[1]);
		}

		// Check in the cookie header
		if (!cookie) {
			cookie = req?.headers?.cookie;

			// if its still not here, return an error
			if (!cookie) {
				console.log("No cookie found");
				return res.status(403).json({
					success: false,
					message: "No JWT token provided",
				});
			}
		}

		let token = "";
		try {
			const tokenParts = cookie.split("=");
			if (tokenParts.length !== 2 || tokenParts[0] !== "token") {
				console.log("Cookie format is invalid");
				console.log("Token parts: ", tokenParts);
				throw new Error("Invalid token format");
			}
			token = tokenParts[1];
		} catch (error) {
			return res.status(403).json({
				success: false,
				message: "Error parsing token: " + error.message,
			});
		}

		try {
			const decodedToken = jwt.verify(token, process.env.MY_SECRET);
			if (!decodedToken) {
				console.log("Token is expired or invalid");
				return res.status(403).json({
					success: false,
					message: "Invalid token",
				});
			}

			console.log("Token is verified: ", req.headers["origin"]);
			return res.json({
				success: true,
				message: "Verified successfully",
				user: decodedToken,
			});
		} catch (err) {
			if (err instanceof jwt.TokenExpiredError) {
				return res.status(403).json({
					success: false,
					message: "Token expired",
				});
			} else if (err instanceof jwt.JsonWebTokenError) {
				return res.status(403).json({
					success: false,
					message: "Invalid token",
				});
			} else {
				return res.status(500).json({
					success: false,
					message: "Internal server error",
				});
			}
		}
	});
};
