const env = require("dotenv").config();
// -----------------------Firebase Firestore setup----------------------
const admin = require("firebase-admin");
const credentials = require("../auth_service_key.js");

admin.initializeApp({
	credential: admin.credential.cert(credentials.credentials),
});

const db = admin.firestore();
// ------------------------------------------------------------------------

// do a database lookup here
const getUser = async (username) => {
	const query_return = await db
		.collection("users")
		.where("username", "==", username)
		.get();

	if (!query_return.empty) {
		const doc = query_return.docs[0];
		const userData = doc.data();

		return userData;
	} else {
		return null;
	}
};

const createUser = async function ({ username, password, role }) {
	const DB_user = await getUser(username);

	if (DB_user) {
		return {
			success: false,
			message: "User already exists",
		};
	} else {
		await db.collection("users").doc(username).set({
			username,
			password,
			role,
		});

		return {
			success: true,
			message: "Signup successful",
			user: {
				username,
				role,
			},
		};
	}
};

const deleteUser = async function (username) {
	try {
		const userDoc = await getUser(username);
		if (!userDoc) {
			return {
				success: false,
				message: "User not found",
			};
		}

		await db.collection("users").doc(username).delete();
		return {
			success: true,
			message: "User deleted successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: "Error deleting user: " + error.message,
		};
	}
};

module.exports = {
	getUser,
	createUser,
	deleteUser,
};
