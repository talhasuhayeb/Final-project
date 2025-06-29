require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AdminModel = require("./Admin");

const mongo_url = process.env.MONGO_CONN;

async function createDefaultAdmin() {
  await mongoose.connect(mongo_url);
  const existing = await AdminModel.findOne({ email: "admin@example.com" });
  if (existing) {
    console.log("Default admin already exists.");
    process.exit(0);
  }
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = new AdminModel({
    name: "Default Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });
  await admin.save();
  console.log("Default admin created: admin@example.com / admin123");
  process.exit(0);
}

createDefaultAdmin();
