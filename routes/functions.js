// do a database lookup here
module.exports.getUser = async (username) => {
	return { password: "123456", username, role: "student" };
};

module.exports.createUser = async function (username, password, role) {
	const DB_user = await getUser(username);

	if (DB_user) {
		return {
			success: false,
			message: "User already exists",
		};
	}

	// go ahead and create user
	// create user in database
	return { username, role };
};
