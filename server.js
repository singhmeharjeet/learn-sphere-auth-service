const env = require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 8080;
const app = express();
const setupLoginRoute = require("./routes/login");
const setupSignupRoute = require("./routes/signup");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({
		message: "Welcome to the Auth Service of Learn Sphere!",
	});
});

setupLoginRoute(app);
setupSignupRoute(app);

app.listen(PORT);
