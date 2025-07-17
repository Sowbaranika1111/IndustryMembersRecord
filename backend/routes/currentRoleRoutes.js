const express = require("express");
const router = express.Router();
const {
  getAllCurrentRoles,
  deleteAllCurrentRoles,
  insertAllCurrentRoles,

  updateCurrentRoleById,
  addSingleCurrentRole,
  deleteCurrentRoleById,
  
} = require("../controllers/dropDownValuesController/currentRoleController.js");

// GET existing current_role values
router.get("/", getAllCurrentRoles);
// router.put("/update/:id", updateCurrentRole); 

// POST new current_role
// router.post("/add", addNewCurrentRole);
router.post('/add-single', addSingleCurrentRole);
router.put('/update/:id',  updateCurrentRoleById);
router.delete('/delete/:id',deleteCurrentRoleById);

// DELETE all roles at a time
router.delete("/delete-all", deleteAllCurrentRoles);

// BULK insert roles
router.post("/insert-many", insertAllCurrentRoles);

module.exports = router;
