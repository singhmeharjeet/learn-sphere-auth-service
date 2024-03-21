const env = require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (app) => {
    app.get("/verify", (req, res) => {
		
        const cookie = req?.headers?.cookie;
		console.log(cookie);
		
        if (!cookie) {
            return res.status(403).json({
                success: false,
                message: "No JWT token provided",
            });
        }

        let token = "";
        try {
            const tokenParts = cookie.split("=");
            if (tokenParts.length !== 2 || tokenParts[0] !== "token") {
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
                return res.status(403).json({
                    success: false,
                    message: "Invalid token",
                });
            }

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
