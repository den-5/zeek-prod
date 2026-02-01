const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  username: { type: String, required: true, unique: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  activationField: { type: String },
  iaActivated: { type: Boolean, default: false },
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
