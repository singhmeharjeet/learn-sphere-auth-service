// do a database lookup here
export const getUser = async (username) => {
	return { password: "123456", username, role: "student" };
};

export async function createUser(username, password, role) {
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
}
