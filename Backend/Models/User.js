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
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{11}$/,
  },
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
