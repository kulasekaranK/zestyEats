const admin = require("firebase-admin");
const serviceAccount = require("../public/admin-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setCustomClaim(uid, role) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log("Custom claim is set for provided UID");
  } catch (error) {
    console.log("Error setting role:", error);
  }
}

const uid = "";
const role = "user";
setCustomClaim(uid, role);
