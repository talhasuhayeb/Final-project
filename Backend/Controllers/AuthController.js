const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const AdminModel = require("../Models/Admin");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const register = async (req, res) => {
  try {
    const { name, email, password, gender, phone, role } = req.body;
    if (role === "admin") {
      // Admin registration
      const admin = await AdminModel.findOne({ email });
      if (admin) {
        return res.status(409).json({
          message: "Admin already exists, you can login",
          success: false,
        });
      }
      const adminModel = new AdminModel({ name, email, password });
      adminModel.password = await bcrypt.hash(password, 10);
      await adminModel.save();
      return res
        .status(201)
        .json({ message: "Admin Signup Successfully", success: true });
    } else {
      // User registration
      const user = await UserModel.findOne({ email });
      if (user) {
        return res.status(409).json({
          message: "User already exists,you can login",
          success: false,
        });
      }
      const userModel = new UserModel({ name, email, password, gender, phone });
      userModel.password = await bcrypt.hash(password, 10);
      await userModel.save();
      return res
        .status(201)
        .json({ message: "Signup Successfully", success: true });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const errorMsg = "Invalid email or password";
    if (role === "admin") {
      const admin = await AdminModel.findOne({ email });
      if (!admin) {
        return res.status(403).json({ message: errorMsg, success: false });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(403).json({ message: errorMsg, success: false });
      }
      const jwtToken = jwt.sign(
        { email: admin.email, _id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.status(200).json({
        message: "Admin Login Successfully",
        success: true,
        jwtToken,
        email,
        name: admin.name,
        role: "admin",
      });
    } else {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(403).json({ message: errorMsg, success: false });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(403).json({ message: errorMsg, success: false });
      }
      const jwtToken = jwt.sign(
        { email: user.email, _id: user._id, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.status(200).json({
        message: "Login Successfully",
        success: true,
        jwtToken,
        email,
        name: user.name,
        role: "user",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    let user;
    if (role === "admin") {
      user = await AdminModel.findOne({ email });
    } else {
      user = await UserModel.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found with this email address",
        success: false,
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password/${resetToken}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #6D2932; text-align: center;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #6D2932; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #6D2932; word-break: break-all;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you did not request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset email sent successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({
      message: "Error sending password reset email",
      success: false,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, role } = req.body;

    let user;
    if (role === "admin") {
      user = await AdminModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
    } else {
      user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "Password reset token is invalid or has expired",
        success: false,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and remove reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Password has been reset successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({
      message: "Error resetting password",
      success: false,
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
