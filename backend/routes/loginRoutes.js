const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController.js");

// Main Authentication Flow
router.post("/generate-otp", loginController.generateOtp);
router.post("/verify-otp", loginController.verifyOtpAndLogin);
router.post("/logout", loginController.logout);
router.get("/check-auth", loginController.checkAuth);

// Admin/Internal Routes
router.put("/role-update", loginController.editLoginAdminRole);
router.get("/details", loginController.getUserByEmail); // Renamed from login-id for clarity

module.exports = router;