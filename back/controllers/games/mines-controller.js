const { Random } = require("random-js");
const jwt = require("jsonwebtoken");
const MinesBoard = require("../../models/MinesBoard");
const User = require("../../models/User");
const random = new Random(); 

class MinesController {
  async checkUserInGame(req, res) {
    const userId = req.user.userId; 

    try {
      const game = await MinesBoard.findOne({ userId: userId });
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      const multiplier = game.multiplier;

      const positions = [];
      for (let i = 0; i < game.minesBoard.length; i++) {
        for (let j = 0; j < game.minesBoard[i].length; j++) {
          if (game.minesBoard[i][j] === 2) {
            positions.push({ x: i, y: j });
          }
        }
      }
      const token = jwt.sign(req.user, process.env.JWT_SECRET);
      res.json({
        message: "User is in the game",
        positions,
        multiplier,
        token,
      });
    } catch (error) {
      console.error("checkUserInGame error:", error.message);
      res.status(500).json({ error: "Failed to check user in game" });
    }
  }

  async createMinesBoard(req, res) {
    if (!req.body.minesCount)
      res.status(400).json({ error: "Mines count is required" });

    req.body.minesCount = JSON.parse(req.body.minesCount);

    if (req.body.minesCount < 1 || req.body.minesCount > 24) {
      return res.status(400).json({
        error: "Incoorect data provided",
      });
    }
    const user = await User.findById(req.user.userId);
    if (user.balance < req.body.pointsInvested) {
      return res
        .status(400)
        .json({ error: "Insufficient funds", invalidEntry: true });
    } else {
      user.balance = user.balance - req.body.pointsInvested;
      await user.save();
    }

    let minesBoard = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    for (let i = 0; i < req.body.minesCount; i++) {
      const randomNumber = random.integer(0, 24);
      const row = Math.floor(randomNumber / 5);
      const col = randomNumber % 5;
      if (minesBoard[row][col] === 1) {
        i--;
      } else {
        minesBoard[row][col] = 1;
      }
    }

    const game = new MinesBoard({
      userId: req.user.userId,
      entry: req.body.pointsInvested,
      minesBoard,
    });

    try {
      await game.save();
      const token = jwt.sign(req.user, process.env.JWT_SECRET);
      res.json({
        minesBoard,
        newBalance: user.balance,
        token,
      });
    } catch (error) {
      console.error("createMinesBoard error:", error.message);
      res.status(500).json({ error: "Failed to save game state" });
    }
  }

  async updateMinesBoard(req, res) {
    const userId = req.user.userId; 
    const target = req.body.target; 
    const token = jwt.sign(req.user, process.env.JWT_SECRET);

    try {
      const bombsPositions = [];
      const game = await MinesBoard.findOne({ userId: userId });
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      const { x, y } = target; 
      if (game.minesBoard[x][y] === 1) {
        const positions = [];
        for (let i = 0; i < game.minesBoard.length; i++) {
          for (let j = 0; j < game.minesBoard[i].length; j++) {
            if (game.minesBoard[i][j] === 2) {
              positions.push({ x: i, y: j });
            }
          }
        }

        for (let i = 0; i < game.minesBoard.length; i++) {
          for (let j = 0; j < game.minesBoard[i].length; j++) {
            if (game.minesBoard[i][j] === 1) {
              bombsPositions.push({ x: i, y: j });
            }
          }
        }

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        await MinesBoard.deleteOne({ userId: userId }); 
        return res.json({
          message: "User lost",
          multiplier: 0,
          positions,
          newBalance: user.balance,
          bombsPositions,
          isPlaying: false,
          token,
        });
      } else if (game.minesBoard[x][y] === 0) {
        game.minesBoard[x][y] = 2;
        game.updatedAt = Date.now();
        await game.save();

        function countMultiplier(mines, openFields) {
          if (openFields < 1) return;
          if (openFields > 25 - mines) return 0;

          let result = 1;

          for (let i = 0; i < openFields; i++) {
            result *= (25 - mines - i) / (25 - i);
          }

          return 96 / (result * 100);
        }

        const positions = [];
        for (let i = 0; i < game.minesBoard.length; i++) {
          for (let j = 0; j < game.minesBoard[i].length; j++) {
            if (game.minesBoard[i][j] === 2) {
              positions.push({ x: i, y: j });
            }
          }
        }
        for (let i = 0; i < game.minesBoard.length; i++) {
          for (let j = 0; j < game.minesBoard[i].length; j++) {
            if (game.minesBoard[i][j] === 1) {
              bombsPositions.push({ x: i, y: j });
            }
          }
        }
        const multiplier = countMultiplier(
          bombsPositions.length,
          positions.length
        );

        game.multiplier = multiplier;
        game.save();

        return res.json({
          message: "Game state updated successfully",
          positions,
          multiplier,
          bombsPositions,
          token,
          isPlaying: true,
        });
      }
    } catch (error) {
      console.error("updateMinesBoard error:", error.message);
      res.status(500).json({ error: "Failed to update game state" });
    }
  }
  async collect(req, res) {
    const userId = req.user.userId; 

    function countMultiplier(mines, openFields) {
      if (openFields < 1) return;
      if (openFields > 25 - mines) return 0;

      let result = 1;

      for (let i = 0; i < openFields; i++) {
        result *= (25 - mines - i) / (25 - i);
      }

      return 96 / (result * 100);
    }

    try {
      const game = await MinesBoard.findOne({ userId: userId });
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const positions = [];
      for (let i = 0; i < game.minesBoard.length; i++) {
        for (let j = 0; j < game.minesBoard[i].length; j++) {
          if (game.minesBoard[i][j] === 2) {
            positions.push({ x: i, y: j });
          }
        }
      }
      const bombsPositions = [];
      for (let i = 0; i < game.minesBoard.length; i++) {
        for (let j = 0; j < game.minesBoard[i].length; j++) {
          if (game.minesBoard[i][j] === 1) {
            bombsPositions.push({ x: i, y: j });
          }
        }
      }

      const entry = game.entry; 
      const multiplier = countMultiplier(
        bombsPositions.length,
        positions.length
      );

      const newBalance = user.balance + entry * multiplier;
      user.balance = newBalance;

      await user.save();

      await MinesBoard.deleteOne({ userId: userId });

      return res.json({
        isWon: true,
        bombsPositions,
        message: "Cash out successful",
        newBalance: user.balance,
        multiplier,
      });
    } catch (error) {
      console.error("collect error:", error.message);
      res.status(500).json({ error: "Failed to cash out" });
    }
  }
}

module.exports = MinesController;
