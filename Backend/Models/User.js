const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detectionSchema = new Schema({
  bloodGroup: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    default: 0,
  },
  processingTime: {
    type: Number,
    default: 0,
  },
  imageQuality: {
    type: Number,
    default: 0,
  },
  filename: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Add virtual property for analysis_id that returns the _id as a string
detectionSchema.virtual("analysis_id").get(function () {
  return this._id.toString();
});

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
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  detectionHistory: [detectionSchema],
});

// Add virtual property for profile_id that returns the _id as a string
userSchema.virtual("profile_id").get(function () {
  return this._id.toString();
});

// Configure Mongoose to include virtuals when converting to JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
