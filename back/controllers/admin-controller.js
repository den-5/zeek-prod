const User = require("../models/User"); // Adjust the path as necessary
const Admin = require("../models/Admin"); // Adjust the path as necessary
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AdminController {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error("getUsers error:", error.message);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
  async getUserByEmail(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
  async changeUserBalance(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.balance = req.body.balance;
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to change user balance" });
    }
  }
  async changeUserPassword(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.password = bcrypt.hashSync(req.body.password, 10); // Hash the password
      await user.save();
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("changeUserPassword error:", error.message);
      res.status(500).json({ error: "Failed to change user password" });
    }
  }
  async changeUserEmail(req, res) {
    try {
      const user = await User.findById(req.body.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.email = req.body.email;
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to change user password" });
    }
  }

  async deleteUser(req, res) {
    try {
      await User.deleteOne({ email: req.body.email });
      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
  async signin(req, res) {
    const { email, password } = req.body;

    try {
      // Find the user by
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: "Access denited" });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: admin._id, email: admin.email },
        process.env.ADMIN_SECRET,
        { expiresIn: "15m" }
      );

      res.status(201).json({ token, email: admin.email });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
  async check(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Verify the token
      const decodedToken = jwt.verify(token, process.env.ADMIN_SECRET);

      // Check if the user exists in the database
      const user = await Admin.findById(decodedToken.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Generate a new token
      const newToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        process.env.ADMIN_SECRET,
        { expiresIn: "5m" }
      );

      // Return the email and new token
      res.json({
        email: user.email,
        token: newToken,
      });
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
  async createAdmin(req, res) {
    const { email, password } = req.body;

    try {
      // Check if the user already exists
      const candidate = await Admin.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const admin = new Admin({ email, password: hashedPassword });
      await admin.save();
      res.status(201).json({ message: "Admin created" });
    } catch (error) {
      console.error("createAdmin error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = AdminController;
