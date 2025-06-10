const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController.js");

router.put("/role-update",loginController.editLoginAdminRole);
router.get("/login-id",loginController.getAdminByEmail);

module.exports = router;
