const { requireRole } = require("../Middlewares/RoleAuth");
const UserModel = require("../Models/User");
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Multer setup for fingerprint image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Ml_server/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Get all users (admin only)
router.get("/users", requireRole("admin"), async (req, res) => {
  try {
    const users = await UserModel.find({}, "-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

// Upload fingerprint image (admin only)
router.post(
  "/upload-fingerprint",
  requireRole("admin"),
  upload.single("fingerprint"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({
      message: "Fingerprint uploaded successfully",
      filename: req.file.filename,
    });
  }
);

// Delete user (admin only)
router.delete("/users/:userId", requireRole("admin"), async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.json({
      message: "User deleted successfully",
      success: true,
      deletedUser: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting user",
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
