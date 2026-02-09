const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const createUserWallets = require("../tools/createUserWallets");
const Wallet = require("../models/Wallet");
const { notifyClients } = require("../tools/websocket-service");
const Transaction = require("../models/Transaction");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const ResetPasswordCode = require("../models/ResetPasswordCode");

exports.changePassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;

  try {
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while changing the password" });
  }
};

exports.signup = async (req, res) => {
  const { email, password, username } = req.body;

  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  try {
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and contain at least one letter and one number",
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const activationField = uuidv4();

    
    

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      activationField,
      balance: 20.0, 
    });
    await newUser.save();

    
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    
    

    res.status(201).json({
      token,
      email: newUser.email,
      username: newUser.username,
      activationField,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(201).json({ token, email: user.email, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    
    req.user = user;

    
    const newToken = jwt.sign(
      {
        userId: decodedToken.userId,
        email: decodedToken.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    
    res.json({
      email: user.email,
      username: user.username,
      token: newToken,
      balance: user.balance,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
exports.getUserWallet = async (req, res) => {
  const user = req.user;
  const currency = req.body.currency;

  try {
    
    const wallet = await Wallet.findOne({ email: user.email });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json({
      wallet: wallet[currency.toLowerCase().replace(/_/g, "") + "_address"],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getUserTransaction = async (req, res) => {
  try {
    const { amount_crypto, currency, order_id, token } = req.body;
    const amount_usd = req.body.invoice_info.amount_usd;

    
    
    
    
    
    
    
    

    const address = req.body.invoice_info.address;
    const wallet = await Wallet.findOne({
      [`${currency.toLowerCase().replace(/_/g, "")}_address`]: address,
    });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    const user = await User.findOne({ email: wallet.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transaction = new Transaction({
      user: user._id,
      type: "payment",
      amount_usd,
      amount_crypto,
      currency,
    });

    
    await transaction.save();

    
    await User.findByIdAndUpdate(user._id, {
      $push: { transactions: transaction._id },
    });

    const newBalance = user.balance + amount_usd;
    user.balance = newBalance;
    await user.save();

    notifyClients({
      newBalance,
      amount_crypto,
      currency,
      order_id,
      amount_usd,
    });
    res.json({ newBalance, amount_crypto, currency, order_id, amount_usd });
  } catch (error) {
    console.error("getUserTransaction error:", error.message);
  }
};
exports.withdrawal = async (req, res) => {
  try {
    const { userId } = req.user;
    const { amount_usd, wallet_address, currency } = req.body;

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (
      parseFloat(user.balance.toFixed(5)) < parseFloat(amount_usd) ||
      user.balance <= 0
    ) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    
    const transaction = new Transaction({
      user: user._id,
      type: "withdrawal",
      wallet_address,
      currency,
      amount_usd,
    });

    
    await transaction.save();

    
    await User.findByIdAndUpdate(user._id, {
      $push: { transactions: transaction._id },
    });

    
    const newBalance = user.balance - amount_usd;
    user.balance = newBalance;
    await user.save();

    
    notifyClients({
      newBalance,
      amount_usd: -amount_usd,
    });

    
    res.json({
      newBalance,
      amount_usd: -amount_usd,
    });
  } catch (error) {
    console.error("withdrawal error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing the withdrawal" });
  }
};

exports.getUserTransactions = async (req, res) => {
  const { userId } = req.user;
  try {
    
    const transactions = await Transaction.find({ user: userId });
    res.json(transactions);
  } catch (error) {
    console.error("getUserTransactions error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { activation } = req.params;
  try {
    const user = await User.findOne({ activationField: activation });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActivated = true;
    await user.save();

    

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("verifyEmail error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
exports.sendForgotPasswordEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetPasswordCode = new ResetPasswordCode({
      userId: user._id,
      code: uuidv4(),
    });
    await resetPasswordCode.save();

    
    

    res.json({ message: "Reset password email sent successfully (email disabled in dev mode)" });
  } catch (error) {
    console.error("sendForgotPasswordEmail error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { code, newPassword } = req.body;
  try {
    const resetPasswordCode = await ResetPasswordCode.findOne({ code });
    if (!resetPasswordCode) {
      return res.status(404).json({ message: "Code not found" });
    }
    const user = await User.findById(resetPasswordCode.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("resetPassword error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
