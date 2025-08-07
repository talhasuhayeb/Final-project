const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const AdminModel = require("../Models/Admin");

const requireRole = (role) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided", success: false });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== role) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role", success: false });
      }

      // Check if user is blocked
      let userIsBlocked = false;
      if (decoded.role === "admin") {
        const admin = await AdminModel.findById(decoded._id);
        if (!admin || admin.isBlocked) {
          userIsBlocked = true;
        }
      } else {
        const user = await UserModel.findById(decoded._id);
        if (!user || user.isBlocked) {
          userIsBlocked = true;
        }
      }

      if (userIsBlocked) {
        return res.status(403).json({
          message:
            "Your account has been blocked. Please contact system administrator.",
          success: false,
        });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }
  };
};

module.exports = { requireRole };
