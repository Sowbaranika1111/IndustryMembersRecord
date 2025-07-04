const express = require("express");
const router = express.Router();
const {
  getAllCurrentRoles,
  deleteAllCurrentRoles,
  insertAllCurrentRoles,
  updateCurrentRole,
  
  // addNewCurrentRole,
  // deleteCurrentRoleById,
  // deleteAllCurrentRoles,
  // insertAllCurrentRoles,
} = require("../controllers/dropDownValuesController/currentRoleController.js");

// GET existing current_role values
router.get("/", getAllCurrentRoles);
router.put("/update/:id", updateCurrentRole); 

// POST new current_role
// router.post("/add", addNewCurrentRole);

// DELETE current_role by ID
// router.delete("/delete/:id", deleteCurrentRoleById);

// DELETE all roles at a time
router.delete("/delete-all", deleteAllCurrentRoles);

// BULK insert roles
router.post("/insert-many", insertAllCurrentRoles);

module.exports = router;
