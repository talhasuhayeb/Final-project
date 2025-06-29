const { register, login } = require("../Controllers/AuthController");
const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/register", signupValidation, register);

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
