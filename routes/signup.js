const env = require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { createUser, getUser } = require("./db.js");

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
				const user = await createUser(username, password, role);

				const modifiedUser = {
					username: user.username,
					role: role,
					iat: user.iat,
				};

				req.user = modifiedUser;

				next();
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: "Error during signup",
					error: error.message,
				});
			}
		},
		passport.authenticate("local-signup", { session: false }),
		(req, res) => {
			//const token = jwt.sign(req.user, process.env.MY_SECRET, { expiresIn: '1h' });

			const token = jwt.sign(req.user, process.env.MY_SECRET);
			/**
			 * {
			 *
			 *
			 * }
			 */
			return res.json({
				success: true,
				message: "Signed up successfully",
				user: req.user,
				token,
			});
		}
	);
};
