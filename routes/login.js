require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { getUser } = require("./db.js");

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await getUser(username);

			if (!user) {
				return done(null, false, { message: "User not found" });
			}

			if (user.password !== password) {
				return done(null, false, { message: "Incorrect password" });
			}

			delete user.password;

			console.log("Logged in successfully");
			return done(null, user);
		} catch (error) {
			console.log("Error in Login Strategy");
			return done(error);
		}
	})
);

module.exports = (app) => {
	app.use(passport.initialize());
	app.post(
		"/login",
		passport.authenticate("local", { session: false }),
		async (req, res) => {
			const token = jwt.sign(req.user, process.env.MY_SECRET);
			res.cookie("jwt", token);
			return res.json({
				success: true,
				message: "Logged in successfully",
				user: req.user,
				token,
			});
		}
	);
};
