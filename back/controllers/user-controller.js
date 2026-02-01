const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model
const createUserWallets = require("../tools/createUserWallets");
const Wallet = require("../models/Wallet");
const { notifyClients } = require("../tools/websocket-service");
const Transaction = require("../models/Transaction");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const ResetPasswordCode = require("../models/ResetPasswordCode");

// DISABLED FOR LOCAL DEVELOPMENT: Email functionality
// Create a transporter using SMTP and environment credentials
/*
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
*/

exports.changePassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Compare the old password with the hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    // Hash the new password
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

// Signup logic
exports.signup = async (req, res) => {
  const { email, password, username } = req.body;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Password validation regex (at least 6 characters, one letter, one number, allows special characters)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  try {
    // Validate email
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and contain at least one letter and one number",
      });
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const activationField = uuidv4();

    // DISABLED FOR LOCAL DEVELOPMENT: Crypto wallet creation
    // await createUserWallets(email);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with $20 starting balance
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      activationField,
      balance: 20.0, // Starting balance for new users
    });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // DISABLED FOR LOCAL DEVELOPMENT: Email verification
    /*
    const sendVerificationEmail = async (email, activationField) => {
      try {
        // Compose the email message
        const mailOptions = {
          from: process.env.SMTP_USER,
          to: email,
          subject: "Email Verification",
          text: `Click the following link to verify your email: ${process.env.FRONTEND_URL}/user/activation/${activationField}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error("sendVerificationEmail error:", error.message);
        throw new Error("Failed to send verification email");
      }
    };

    await sendVerificationEmail(newUser.email, newUser.activationField);
    */

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
// Signin logic
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
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

// Check authentication middleware
exports.checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists in the database
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Generate a new token
    const newToken = jwt.sign(
      {
        userId: decodedToken.userId,
        email: decodedToken.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Return the email and new token
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
    // Find the user's wallet
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

    // const decodedToken = jwt.decode(
    //   token,
    //   process.env.SECRET_KEY_CRYPTO,
    //   (algorithm = "HS256")
    // );
    // if (!decodedToken) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

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

    // Save the transaction
    await transaction.save();

    // Update the user's transaction history
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

    // Find the user by ID
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

    // Create a new transaction
    const transaction = new Transaction({
      user: user._id,
      type: "withdrawal",
      wallet_address,
      currency,
      amount_usd,
    });

    // Save the transaction
    await transaction.save();

    // Update the user's transaction history
    await User.findByIdAndUpdate(user._id, {
      $push: { transactions: transaction._id },
    });

    // Update the user's balance
    const newBalance = user.balance - amount_usd;
    user.balance = newBalance;
    await user.save();

    // Notify clients about the new balance and withdrawal details
    notifyClients({
      newBalance,
      amount_usd: -amount_usd,
    });

    // Respond with the new balance and withdrawal details
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
    // Find the user's transactions
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

    // Send the verification email

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

    // DISABLED FOR LOCAL DEVELOPMENT: Password reset email
    /*
    const sendResetPasswordEmail = async (email, code) => {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Reset Password",
        text: `Here is your reset password link: ${process.env.FRONTEND_URL}/auth/forgot-password/${code}`,
      };

      await transporter.sendMail(mailOptions);
    };

    await sendResetPasswordEmail(user.email, resetPasswordCode.code);
    */

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
