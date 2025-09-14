const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directories if they don't exist
const profileUploadsDir = path.join(__dirname, "../uploads/profile-pictures");
const fingerprintUploadsDir = path.join(__dirname, "../uploads/fingerprints");

if (!fs.existsSync(profileUploadsDir)) {
  fs.mkdirSync(profileUploadsDir, { recursive: true });
}

if (!fs.existsSync(fingerprintUploadsDir)) {
  fs.mkdirSync(fingerprintUploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check route to determine destination folder
    if (req.originalUrl.includes("upload-fingerprint")) {
      cb(null, fingerprintUploadsDir);
    } else {
      cb(null, profileUploadsDir);
    }
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and user ID
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const userId = req.user?.id || "unknown";

    // If fingerprint upload
    if (req.originalUrl.includes("upload-fingerprint")) {
      cb(
        null,
        `fingerprint-${userId}-${uniqueSuffix}${path.extname(
          file.originalname
        )}`
      );
    } else {
      cb(
        null,
        `profile-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`
      );
    }
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
