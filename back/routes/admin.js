const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin-controller");
const authenticateToken = require("../middleware/authenticate-admin");

const adminController = new AdminController();

// Signin route
router.post("/signin", adminController.signin);

// Protected route
router.get("/check", adminController.check);
router.post("/getUser", authenticateToken, adminController.getUserByEmail);
router.post(
  "/changeBalance",
  authenticateToken,
  adminController.changeUserBalance
);
router.post(
  "/changePassword",
  authenticateToken,
  adminController.changeUserPassword
);
router.post("/deleteUser", authenticateToken, adminController.deleteUser);
router.get("/users", authenticateToken, adminController.getUsers);
router.post("/createAdmin", authenticateToken, adminController.createAdmin);

module.exports = router;
