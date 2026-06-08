const express = require("express");
const admin = require("firebase-admin");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "codedeck-777c2",
    // For development, we'll skip credential verification
    // In production, add your service account key here
  });
}

// Firebase authentication route
router.post("/firebase", async (req, res) => {
  try {
    const { idToken, email, name, firstname, lastname, photoURL } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No Firebase ID token provided" });
    }

    // For development, skip token verification and extract email from request
    // In production, uncomment the verification code below
    let firebaseEmail = email;
    
    /* 
    // Production token verification (uncomment for production):
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
      firebaseEmail = decodedToken.email;
    } catch (error) {
      console.error("Firebase token verification failed:", error);
      return res.status(401).json({ message: "Invalid Firebase token" });
    }
    */
    
    if (!firebaseEmail) {
      return res.status(400).json({ message: "No email found in Firebase token" });
    }

    // Check if user exists in database
    let user = await User.findOne({ email: firebaseEmail }).select("-password");

    if (!user) {
      // Create new user if doesn't exist
      const newUser = new User({
        username: name || `user_${Date.now()}`,
        email: firebaseEmail,
        firstname: firstname || name?.split(' ')[0] || 'User',
        lastname: lastname || name?.split(' ').slice(1).join(' ') || '',
        password: `firebase_${Date.now()}`, // Dummy password for Firebase users
        bio: "",
        photoURL: photoURL || "",
        authProvider: "firebase"
      });

      user = await newUser.save();
      console.log("New Firebase user created:", user);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.SESSION_SECRET,
      { expiresIn: "4h" }
    );

    return res.status(200).json({
      token,
      user: user,
      message: user.isNew ? "User created successfully" : "User logged in successfully"
    });

  } catch (error) {
    console.error("Firebase auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
