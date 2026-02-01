const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const authenticateToken = require("../middleware/authenticate-token");

// Signup route
router.post("/signup", userController.signup);

// Signin route
router.post("/signin", userController.signin);

// Protected route
router.get("/checkAuth", userController.checkAuth);

router.post(
  "/get-user-wallet",
  authenticateToken,
  userController.getUserWallet
);

router.post("/get-user-transaction", userController.getUserTransaction);

router.post("/withdrawal", authenticateToken, userController.withdrawal);
router.get(
  "/get-user-transactions",
  authenticateToken,
  userController.getUserTransactions
);
router.get("/verify/:activation", userController.verifyEmail);
router.post(
  "/change-password",
  authenticateToken,
  userController.changePassword
);
router.post(
  "/send-forgot-password-email",
  userController.sendForgotPasswordEmail
);
router.post("/reset-password", userController.resetPassword);

module.exports = router;
