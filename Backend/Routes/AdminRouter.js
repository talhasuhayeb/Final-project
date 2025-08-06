const { requireRole } = require("../Middlewares/RoleAuth");
const UserModel = require("../Models/User");
const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
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

// Create a new user (admin only)
router.post("/users", requireRole("admin"), async (req, res) => {
  try {
    const { name, email, password, gender, phone, dateOfBirth, role } =
      req.body;

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // Create the new user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      gender,
      phone,
      dateOfBirth: dateOfBirth || null,
      role: role || "user",
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating user",
      success: false,
      error: err.message,
    });
  }
});

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

// Toggle user block status
router.patch("/users/:userId/block", requireRole("admin"), async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Toggle the block status
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating user block status",
      success: false,
      error: err.message,
    });
  }
});

// Update user role
router.patch("/users/:userId/role", requireRole("admin"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role specified. Role must be 'user' or 'admin'",
        success: false,
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role updated to ${role} successfully`,
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating user role",
      success: false,
      error: err.message,
    });
  }
});

// Get detection records with optional filtering
router.get("/detection-records", requireRole("admin"), async (req, res) => {
  try {
    const { userId, bloodGroup, startDate, endDate } = req.query;

    let query = {};

    // If a specific user is requested
    if (userId) {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      // Return just this user's detection history
      return res.json({
        success: true,
        records: user.detectionHistory.map((record) => ({
          ...record.toObject(),
          userName: user.name,
          userEmail: user.email,
          userId: user._id,
        })),
      });
    }

    // Get all users with detection history
    const users = await UserModel.find({
      "detectionHistory.0": { $exists: true },
    });

    // Combine and format all records
    let allRecords = [];
    users.forEach((user) => {
      const userRecords = user.detectionHistory.map((record) => ({
        ...record.toObject(),
        userName: user.name,
        userEmail: user.email,
        userId: user._id,
      }));
      allRecords = [...allRecords, ...userRecords];
    });

    // Apply filters
    let filteredRecords = allRecords;

    // Filter by blood group
    if (bloodGroup) {
      filteredRecords = filteredRecords.filter(
        (record) => record.bloodGroup.toLowerCase() === bloodGroup.toLowerCase()
      );
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      filteredRecords = filteredRecords.filter(
        (record) => new Date(record.timestamp) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day
      filteredRecords = filteredRecords.filter(
        (record) => new Date(record.timestamp) <= end
      );
    }

    // Sort by timestamp (newest first)
    filteredRecords.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json({ success: true, records: filteredRecords });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching detection records",
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
