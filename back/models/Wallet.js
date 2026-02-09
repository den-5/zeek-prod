const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  usdttrc20_address: { type: String, required: false },
  usdctrc20_address: { type: String, required: false },
  tusdtrc20_address: { type: String, required: false },
  usdterc20_address: { type: String, required: false },
  usdcerc20_address: { type: String, required: false },
  tusderc20_address: { type: String, required: false },
  btc_address: { type: String, required: false },
  ltc_address: { type: String, required: false },
  eth_address: { type: String, required: false },
});

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
