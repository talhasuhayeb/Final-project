const jwt = require("jsonwebtoken");

const requireRole = (role) => {
  return (req, res, next) => {
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
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }
  };
};

module.exports = { requireRole };
