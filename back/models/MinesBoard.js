const mongoose = require("mongoose");

const minesBoardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  minesBoard: { type: [[Number]], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  entry: { type: Number },
  multiplier: { type: Number, default: 1 },
});

const MinesBoard = mongoose.model("MinesBoard", minesBoardSchema);

module.exports = MinesBoard;
