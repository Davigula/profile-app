const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  role: { type: String, default: "user" }
});

module.exports = mongoose.model("user", userSchema);