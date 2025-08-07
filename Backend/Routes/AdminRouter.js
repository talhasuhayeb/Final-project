const { requireRole } = require("../Middlewares/RoleAuth");
const UserModel = require("../Models/User");
const AdminModel = require("../Models/Admin");
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

    // Check if email already exists in users collection
    const existingUser = await UserModel.findOne({ email });

    // Also check in admin collection if role is admin
    const existingAdmin = await AdminModel.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // Create the new user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // If role is admin, create in both collections
    if (role === "admin") {
      try {
        // Create in admin collection with required fields from the admin schema
        const newAdmin = new AdminModel({
          name,
          email,
          password: hashedPassword,
          role: "admin",
          // Add any other required admin fields here
        });

        await newAdmin.save();
        console.log(
          `New admin user ${name} created in admin collection with ID: ${newAdmin._id}`
        );
      } catch (adminErr) {
        console.error("Error creating admin in admin collection:", adminErr);
        // Continue with user creation even if admin creation fails
      }
    }

    // Always create in users collection for UI consistency
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
        role: newUser.role,
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

    // Find the user to get their email and role before deletion
    const userToDelete = await UserModel.findById(userId);

    if (!userToDelete) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Delete from user collection
    await UserModel.findByIdAndDelete(userId);

    // If user is also an admin, delete from admin collection
    if (userToDelete.role === "admin") {
      const adminToDelete = await AdminModel.findOne({
        email: userToDelete.email,
      });

      if (adminToDelete) {
        await AdminModel.findByIdAndDelete(adminToDelete._id);
        console.log(
          `Admin ${userToDelete.name} also deleted from admin collection`
        );
      }
    }

    res.json({
      message: "User deleted successfully",
      success: true,
      deletedUser: {
        id: userToDelete._id,
        name: userToDelete.name,
        email: userToDelete.email,
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

    // Toggle the block status in users collection
    user.isBlocked = !user.isBlocked;
    await user.save();

    // If the user is also in the admin collection, update block status there too
    if (user.role === "admin") {
      const adminUser = await AdminModel.findOne({ email: user.email });
      if (adminUser) {
        // Make sure the admin model has isBlocked field
        adminUser.isBlocked = user.isBlocked;
        await adminUser.save();
        console.log(
          `Admin ${user.name} also ${
            user.isBlocked ? "blocked" : "unblocked"
          } in admin collection`
        );
      }
    }

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

    // Update the user's role in the users collection
    user.role = role;
    await user.save();

    // Handle admin collection based on role change
    if (role === "admin") {
      // Check if this user already exists in the admin collection
      const existingAdmin = await AdminModel.findOne({ email: user.email });

      if (!existingAdmin) {
        // Create a new admin record
        const newAdmin = new AdminModel({
          name: user.name,
          email: user.email,
          password: user.password, // Use the same hashed password
          role: "admin",
        });

        await newAdmin.save();
        console.log(`User ${user.name} has been added to admin collection`);
      }
    } else if (role === "user" || role === "regular") {
      // If changing from admin to user, remove from admin collection
      const adminToRemove = await AdminModel.findOne({ email: user.email });
      if (adminToRemove) {
        await AdminModel.findByIdAndDelete(adminToRemove._id);
        console.log(`User ${user.name} removed from admin collection`);
      }
    }

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

      // Get this user's detection history and add user info
      let userRecords = user.detectionHistory.map((record) => ({
        ...record.toObject(),
        userName: user.name,
        userEmail: user.email,
        userId: user._id,
      }));

      // Apply blood group filter if specified
      if (bloodGroup) {
        userRecords = userRecords.filter(
          (record) => record.bloodGroup === bloodGroup
        );
      }

      // Apply date filters
      if (startDate) {
        const start = new Date(startDate);
        userRecords = userRecords.filter(
          (record) => new Date(record.timestamp) >= start
        );
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set to end of day
        userRecords = userRecords.filter(
          (record) => new Date(record.timestamp) <= end
        );
      }

      // Sort by timestamp (newest first)
      userRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return res.json({
        success: true,
        records: userRecords,
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
      console.log(`Filtering by blood group: ${bloodGroup}`);
      console.log(
        `Available records before filter:`,
        filteredRecords.map((r) => r.bloodGroup)
      );

      filteredRecords = filteredRecords.filter((record) => {
        const matches = record.bloodGroup === bloodGroup;
        console.log(
          `Record ${record._id}: ${record.bloodGroup} matches ${bloodGroup}? ${matches}`
        );
        return matches;
      });

      console.log(`Records after filter: ${filteredRecords.length}`);
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

// Repair admin entries - ensures all admins exist in both collections
router.post("/repair-admins", requireRole("admin"), async (req, res) => {
  try {
    // Get all users with admin role from users collection
    const adminUsers = await UserModel.find({ role: "admin" });

    // Get all admins from admin collection
    const adminEntries = await AdminModel.find({});

    const adminEmails = adminEntries.map((admin) => admin.email);
    const userEmails = adminUsers.map((user) => user.email);

    const results = {
      adminsAdded: 0,
      usersAdded: 0,
      adminsFound: adminEntries.length,
      adminUsersFound: adminUsers.length,
    };

    // Add missing admin entries to admin collection
    for (const user of adminUsers) {
      if (!adminEmails.includes(user.email)) {
        // This user is an admin in users collection but not in admin collection
        const newAdmin = new AdminModel({
          name: user.name,
          email: user.email,
          password: user.password, // Use existing password hash
          role: "admin",
          isBlocked: user.isBlocked,
        });

        await newAdmin.save();
        results.adminsAdded++;
        console.log(
          `Repaired: Added ${user.name} (${user.email}) to admin collection`
        );
      }
    }

    // Add missing admin users to users collection
    for (const admin of adminEntries) {
      if (!userEmails.includes(admin.email)) {
        // This admin exists in admin collection but not in users collection
        const newUser = new UserModel({
          name: admin.name,
          email: admin.email,
          password: admin.password, // Use existing password hash
          role: "admin",
          gender: "Other", // Default value
          phone: "00000000000", // Default value
          isBlocked: admin.isBlocked || false,
        });

        await newUser.save();
        results.usersAdded++;
        console.log(
          `Repaired: Added ${admin.name} (${admin.email}) to users collection`
        );
      }
    }

    res.json({
      message: "Admin repair completed",
      success: true,
      results,
    });
  } catch (err) {
    console.error("Error repairing admins:", err);
    res.status(500).json({
      message: "Error repairing admins",
      success: false,
      error: err.message,
    });
  }
});

// Create admin user (super admin only)
router.post("/create-admin", requireRole("admin"), async (req, res) => {
  try {
    const { name, email, password, gender, phone, dateOfBirth } = req.body;

    // Check if email already exists in users collection
    const existingUser = await UserModel.findOne({ email });

    // Also check in admin collection
    const existingAdmin = await AdminModel.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // Create the new user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create in admin collection first
    const newAdmin = new AdminModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    console.log(
      `Admin ${name} created in admin collection with ID: ${newAdmin._id}`
    );

    // Also create in users collection for UI consistency
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      gender: gender || "Other",
      phone: phone || "00000000000", // Default if not provided
      dateOfBirth: dateOfBirth || null,
      role: "admin",
    });

    await newUser.save();
    console.log(
      `Admin ${name} also created in users collection with ID: ${newUser._id}`
    );

    res.status(201).json({
      message: "Admin created successfully",
      success: true,
      admin: {
        id: newAdmin._id,
        userCollectionId: newUser._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({
      message: "Error creating admin",
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
