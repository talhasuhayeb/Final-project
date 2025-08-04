const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: null,
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{11}$/,
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  fingerprintImage: {
    type: String,
    default: null,
  },
  bloodType: {
    type: String,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
