const env = require("dotenv").config();
// -----------------------Firebase Firestore setup----------------------
const admin = require("firebase-admin");
const credentials = require("../auth_service_key.js");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();
// ------------------------------------------------------------------------

// do a database lookup here
module.exports.getUser = async (username) => {
  const query_return = await db
    .collection("users")
    .where("username", "==", username)
    .get();

  if (!query_return.empty) {
    const doc = query_return.docs[0];
    const userData = doc.data();

    return userData;
  } else {
    return { success: false, message: "User not found" };
  }
  //   return { password: "123456", username, role: "student" };
};

module.exports.createUser = async function (username, password, role) {
  const DB_user = await getUser(username);

  if (DB_user) {
    return {
      success: false,
      message: "User already exists",
    };
  } else {
    const userJson = {
      username: username,
      password: password,
      role: role,
    };

    const db_response = await db.collection("users").doc(userJson.username).set(userJson);

    return {
      username: userJson.username,
      role: userJson.role,
    };
  }

  // go ahead and create user
  // create user in database
  //   return { username, role };
};
