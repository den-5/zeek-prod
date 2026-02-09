const { Random } = require("random-js");
const jwt = require("jsonwebtoken");
const User = require("../../models/User"); 
const random = new Random(); 

class LimboController {
  async getLimboMultiplier(req, res) {
    if (req.body.successChance > 98.01980198 || req.body.successChance < 0.000099) {
      return res.status(400).json({
        error: "Incorrect data provided",
      });
    }

    let isSuccess = false;
    const randomNumber = random.integer(0, 16777215);
    const multiplier = (16777216 / (randomNumber + 1)) * (1 - 0.01);

    if (req.body.target <= multiplier) {
      isSuccess = true;
    }

    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.balance < req.body.entry) {
        return res
          .status(400)
          .json({ error: "Insufficient funds", invalidEntry: true });
      }

      const entry = req.body.entry; 
      if (isSuccess) {
        user.balance += entry * req.body.target - entry;
      } else {
        user.balance -= entry;
      }

      await user.save();

      const token = jwt.sign(req.user, process.env.JWT_SECRET);

      res.json({
        multiplier,
        randomNumber,
        isSuccess,
        token,
        newBalance: user.balance,
      });
    } catch (error) {
      console.error("getLimboMultiplier error:", error.message);
      res.status(500).json({ error: "Failed to process the request" });
    }
  }
}

module.exports = LimboController;
