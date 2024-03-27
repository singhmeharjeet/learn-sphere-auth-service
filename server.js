const env = require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 8090;
const app = express();
const cors = require("cors");

const setupLoginRoute = require("./routes/login");
const setupSignupRoute = require("./routes/signup");
const setupVerifyRoute = require("./routes/verify");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/auth-service/", (req, res) => {
	res.json({
		message: "Welcome to the Auth Service of Learn Sphere!",
	});
});

setupLoginRoute(app);
setupSignupRoute(app);
setupVerifyRoute(app);

app.listen(PORT, () => {
	console.log(`Auth Service is running on port: ${PORT}`);
});
