const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../Controllers/AuthController");
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
const router = require("express").Router();

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
      name: user.name,
      email: user.email,
      phoneNumber: user.phone,
      gender: user.gender,
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
router.post("/send-prediction-email", sendPredictionEmail);

// Update user's fingerprint data
router.post("/update-fingerprint", async (req, res) => {
  const { filename, bloodType } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided", success: false });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.fingerprintImage = filename;
    user.bloodType = bloodType;
    await user.save();

    res.json({
      message: "Fingerprint data updated successfully",
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating fingerprint data", success: false });
  }
});

module.exports = router;
