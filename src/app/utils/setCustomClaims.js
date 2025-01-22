const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const setCustomClaims = async (email, isAdmin) => {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);

    // Set custom claims (e.g., isAdmin)
    await admin.auth().setCustomUserClaims(user.uid, { isAdmin });

    console.log(`Successfully set isAdmin=${isAdmin} for ${email}`);
  } catch (error) {
    console.error("Error setting custom claims:", error.message);
  }
};

const userEmail = "admin@admin.com"; // Admin email
const adminRole = true; // Set to true for admin, false for regular user

setCustomClaims(userEmail, adminRole);
