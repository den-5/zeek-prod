const { Random } = require("random-js");
const jwt = require("jsonwebtoken");
const random = new Random(); // Create a Random instance
const User = require("../../models/User");

class DiceController {
  async getRandomNumber(req, res) {
    if (req.body.successChance > 98 || req.body.successChance < 0.01) {
      return res.status(400).json({
        error: "Incoorect data provided",
      });
    }
    const successChance = parseFloat(req.body.successChance);
    let rollOver;
    let isSuccess;
    const multiplier = 96 / successChance;
    const randomNumber = random.integer(1, 100);
    if (req.body.variant === "over") {
      rollOver = 100 - successChance;
      isSuccess = randomNumber > rollOver;
    } else {
      rollOver = successChance;
      isSuccess = randomNumber < rollOver;
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
        user.balance += entry * multiplier - entry;
      } else {
        user.balance -= entry;
      }

      await user.save();
      const token = jwt.sign(req.user, process.env.JWT_SECRET);

      res.json({
        successChance,
        newBalance: user.balance,
        rollOver,
        multiplier,
        randomNumber,
        isSuccess,
        token,
      });
    } catch (error) {
      console.error("getRandomNumber error:", error.message);
      res.status(500).json({ error: "Failed to process the request" });
    }
  }
}

module.exports = DiceController;
