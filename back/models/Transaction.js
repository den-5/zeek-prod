const mongoose = require("mongoose");

// Define the Transaction schema
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["payment", "withdrawal"], required: true },
  amount_usd: { type: Number, required: true },
  amount_crypto: { type: Number },
  currency: { type: String },
  wallet_address: { type: String },
  date: { type: Date, default: Date.now },
});

// Create the Transaction model
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
