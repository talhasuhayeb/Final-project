const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const AdminModel = require("../Models/Admin");

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
        return res
          .status(409)
          .json({
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

module.exports = {
  register,
  login,
};
