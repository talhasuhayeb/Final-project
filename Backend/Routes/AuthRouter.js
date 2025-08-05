const {
  register,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  removeProfilePicture,
} = require("../Controllers/AuthController");
const {
  getDetectionHistory,
  getDetectionById,
  generateDetectionReport,
  saveDetection,
} = require("../Controllers/DetectionController");
const { sendPredictionEmail } = require("../Controllers/EmailController");
const {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../Middlewares/AuthValidation");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const SmsController = require("../Controllers/SmsController");
const upload = require("../Middlewares/UploadMiddleware");
const router = require("express").Router();

// JWT verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded._id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Get current user info (for phone number)
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id, // Include the MongoDB _id
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      profilePicture: user.profilePicture,
      bloodType: user.bloodType,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user info" });
  }
});

router.post("/login", loginValidation, login);
router.post("/register", signupValidation, register);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/reset-password/:token", resetPasswordValidation, resetPassword);
router.put(
  "/update-profile",
  authenticateToken,
  upload.single("profilePicture"),
  updateProfile
);
router.delete(
  "/remove-profile-picture",
  authenticateToken,
  removeProfilePicture
);
router.post("/send-prediction-email", sendPredictionEmail);

// Update user's fingerprint data
router.post("/update-fingerprint", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      filename,
      bloodType,
      confidence,
      imageQuality,
      timestamp,
      processingTime,
    } = req.body;

    console.log("Update Fingerprint Request Body:", req.body);
    console.log("User ID:", userId);

    const user = await UserModel.findById(userId);

    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    console.log("User found:", user.name);
    console.log("Detection history array exists:", !!user.detectionHistory);

    user.fingerprintImage = filename;
    user.bloodType = bloodType;

    // Prepare detection record
    const detectionRecord = {
      bloodGroup: bloodType,
      confidence: confidence || 0,
      processingTime: processingTime || 0,
      imageQuality: imageQuality || 0,
      filename: filename,
      timestamp: new Date(timestamp || Date.now()),
    };

    console.log("Adding detection record:", detectionRecord);

    // Add to detection history
    if (!user.detectionHistory) {
      console.log("Creating new detection history array");
      user.detectionHistory = [];
    }

    user.detectionHistory.push(detectionRecord);

    console.log("New detection history length:", user.detectionHistory.length);

    await user.save();
    console.log("User saved successfully");

    res.json({
      message: "Fingerprint data updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error updating fingerprint data:", err);
    res.status(500).json({
      message: "Error updating fingerprint data",
      success: false,
      error: err.message,
    });
  }
});

// Detection history routes
router.get("/detection-history", authenticateToken, getDetectionHistory);
router.get("/detection/:detectionId", authenticateToken, getDetectionById);
router.get(
  "/detection/:detectionId/report",
  authenticateToken,
  generateDetectionReport
);

module.exports = router;
