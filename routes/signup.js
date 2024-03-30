const env = require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { createUser, getUser, createProfile } = require("./db.js");

passport.use(
	"local-signup",
	new LocalStrategy(async (username, password, done) => {
		try {
			return done(null, { username, password });
		} catch (error) {
			return done(error);
		}
	})
);

module.exports = (app) => {
	app.use(passport.initialize());

	app.post(
		"/api/auth-service/signup",
		async (req, res, next) => {
			try {
				const { username, password, role } = req.body;

				const existingUser = await getUser(username);
				if (existingUser) {
					return res.status(400).json({
						success: false,
						message: "User already exists",
					});
				}
				const response = await createUser({
					username,
					password,
					role,
				});

				if (response.success) {
					const token = jwt.sign(
						{
							username,
							role,
						},
						process.env.MY_SECRET
					);
					return res.json({
						success: true,
						message: "User Signed Up Successfully",
						user: {
							username: response.user.username,
							role: response.user.role,
						},
						token,
					});
				} else {
					throw new Error(response.message);
				}
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: "Error during signup",
					error: error.message,
				});
			}
		},
		passport.authenticate("local-signup", { session: false }),
		async (req, res) => {
			//const token = jwt.sign(req.user, process.env.MY_SECRET, { expiresIn: '1h' });
			const user = getUser(req.user.username);
			delete user.password;
			const token = jwt.sign(user, process.env.MY_SECRET);

			return res.status(200).json({
				success: true,
				message: "Signed up successfully",
				user: req.user,
				token,
			});
		}
	);
};
