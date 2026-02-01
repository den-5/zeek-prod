const mongoose = require("mongoose");

const resetPasswordCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 },
  updatedAt: { type: Date, default: Date.now },
});

const ResetPasswordCode = mongoose.model(
  "ResetPasswordCode",
  resetPasswordCodeSchema
);
module.exports = ResetPasswordCode;
