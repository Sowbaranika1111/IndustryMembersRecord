const express = require("express");
const router = express.Router();
const {
  getAllCurrentRoles,
<<<<<<< Updated upstream
  addNewCurrentRole,
  deleteCurrentRoleById,
  deleteAllCurrentRoles,
  insertAllCurrentRoles,
} = require("../controllers/dropDownValuesController/currentRoleController.js");

// GET existing current_role values
router.get("/", getAllCurrentRoles);

// POST new current_role
router.post("/add", addNewCurrentRole);

// DELETE current_role by ID
router.delete("/delete/:id", deleteCurrentRoleById);

//DELETE all roles at a time
router.delete("/deleteall", deleteAllCurrentRoles);

// BULK insert roles
router.post("/bulk-insert", insertAllCurrentRoles);
=======
  deleteAllCurrentRoles,
  insertAllCurrentRoles,
  updateCurrentRole,
  
  // addNewCurrentRole,
  // deleteCurrentRoleById,
  // deleteAllCurrentRoles,
  // insertAllCurrentRoles,
} = require("../controllers/dropDownValuesController/currentRoleController.js");

// GET existing current_role values
router.get("/getAllCurrentRoles", getAllCurrentRoles);
router.put("/updateCurrentRole/:id", updateCurrentRole); 

// POST new current_role
// router.post("/add", addNewCurrentRole);

// DELETE current_role by ID
// router.delete("/delete/:id", deleteCurrentRoleById);

// DELETE all roles at a time
router.delete("/deleteAllCurrentRoles", deleteAllCurrentRoles);

// BULK insert roles
router.post("/insertAllCurrentRoles", insertAllCurrentRoles);
>>>>>>> Stashed changes

module.exports = router;
