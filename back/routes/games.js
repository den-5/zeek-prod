const express = require("express");
const DiceController = require("../controllers/games/dice-controller");
const LimboController = require("../controllers/games/limbo-controller");
const authenticateToken = require("../middleware/authenticate-token");
const MinesController = require("../controllers/games/mines-controller");

const router = express.Router();

const diceController = new DiceController();
const limboController = new LimboController();
const minesController = new MinesController();

router.post("/random-number", authenticateToken, (req, res) => {
  
  diceController.getRandomNumber(req, res);
});

router.post("/limbo", authenticateToken, (req, res) => {
  limboController.getLimboMultiplier(req, res);
});

router.post("/mines/start", authenticateToken, (req, res) => {
  minesController.createMinesBoard(req, res);
});
router.post("/mines/update", authenticateToken, (req, res) => {
  minesController.updateMinesBoard(req, res);
});
router.get("/mines/check-user-in-game", authenticateToken, (req, res) => {
  minesController.checkUserInGame(req, res);
});

router.post("/mines/collect", authenticateToken, (req, res) => {
  minesController.collect(req, res);
});

module.exports = router;
