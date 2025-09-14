const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const UserModel = require("../Models/User");
const crypto = require("crypto");
const chokidar = require("chokidar");

// Create a folder for temporary scanner files
const createTempFolder = async (req, res) => {
  try {
    const { folderPath } = req.body;

    if (!folderPath) {
      return res.status(400).json({
        message: "Folder path is required",
        success: false,
      });
    }

    const fullPath = path.join(__dirname, "..", folderPath);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    res.json({
      message: "Temporary folder created successfully",
      success: true,
      path: fullPath,
    });
  } catch (err) {
    console.error("Error creating temporary folder:", err);
    res.status(500).json({
      message: "Error creating temporary folder",
      success: false,
      error: err.message,
    });
  }
};

// Launch the ZKTeco fingerprint scanner SDK
const launchFingerScanner = async (req, res) => {
  try {
    const { sdkPath } = req.body;

    if (!sdkPath) {
      return res.status(400).json({
        message: "SDK path is required",
        success: false,
      });
    }

    // Check if the SDK executable exists
    if (!fs.existsSync(sdkPath)) {
      return res.status(404).json({
        message: "SDK executable not found",
        success: false,
      });
    }

    // Launch the SDK
    exec(`"${sdkPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error launching SDK: ${error.message}`);
        return res.status(500).json({
          message: "Error launching fingerprint scanner SDK",
          success: false,
          error: error.message,
        });
      }

      if (stderr) {
        console.error(`SDK stderr: ${stderr}`);
      }

      console.log(`SDK stdout: ${stdout}`);
    });

    res.json({
      message: "Fingerprint scanner SDK launched successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error launching fingerprint scanner SDK:", err);
    res.status(500).json({
      message: "Error launching fingerprint scanner SDK",
      success: false,
      error: err.message,
    });
  }
};

// Watch for and process new fingerprint images
const watchForFingerprint = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const sourceFolder = path.join(__dirname, "..");
    const sourceFile = path.join(sourceFolder, "Fingerprint.bmp");
    const destFolder = path.join(sourceFolder, "uploads", "fingerprints");

    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    // Generate a unique analysis ID
    const analysisId = Date.now() + "-" + Math.floor(Math.random() * 100000000);
    const uniqueFileName = `fingerprint-${user._id}-${analysisId}.bmp`;
    const destPath = path.join(destFolder, uniqueFileName);

    // Set up watcher for the fingerprint file
    const watcher = chokidar.watch(sourceFile, {
      persistent: false,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    });

    let timeout = setTimeout(() => {
      watcher.close();
      res.status(408).json({
        message: "Timeout waiting for fingerprint image",
        success: false,
      });
    }, 30000); // 30 seconds timeout

    watcher.on("add", (filePath) => {
      clearTimeout(timeout);

      // Copy and rename the file
      fs.copyFile(filePath, destPath, (err) => {
        if (err) {
          console.error("Error copying fingerprint file:", err);
          return res.status(500).json({
            message: "Error saving fingerprint image",
            success: false,
            error: err.message,
          });
        }

        // Update user's fingerprintImage field
        user.fingerprintImage = `/uploads/fingerprints/${uniqueFileName}`;
        user
          .save()
          .then(() => {
            watcher.close();

            // Read the file as a base64 string to send to the client for consistent display
            fs.readFile(destPath, (readErr, data) => {
              if (readErr) {
                console.error(
                  "Error reading file for base64 conversion:",
                  readErr
                );
                return res.json({
                  message: "Fingerprint image saved successfully",
                  success: true,
                  filePath: `/uploads/fingerprints/${uniqueFileName}`,
                  fileName: uniqueFileName,
                  analysisId: analysisId,
                  profileId: user._id,
                });
              }

              // Convert file to base64
              const base64Image = `data:image/bmp;base64,${data.toString(
                "base64"
              )}`;

              res.json({
                message: "Fingerprint image saved successfully",
                success: true,
                filePath: `/uploads/fingerprints/${uniqueFileName}`,
                fileName: uniqueFileName,
                analysisId: analysisId,
                profileId: user._id,
                base64Image: base64Image,
              });
            });
          })
          .catch((err) => {
            console.error("Error updating user record:", err);
            res.status(500).json({
              message: "Error updating user record",
              success: false,
              error: err.message,
            });
          });
      });
    });

    watcher.on("error", (error) => {
      clearTimeout(timeout);
      console.error("Watcher error:", error);
      res.status(500).json({
        message: "Error watching for fingerprint file",
        success: false,
        error: error.message,
      });
    });
  } catch (err) {
    console.error("Error in watchForFingerprint:", err);
    res.status(500).json({
      message: "Error processing fingerprint image",
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  createTempFolder,
  launchFingerScanner,
  watchForFingerprint,
};
