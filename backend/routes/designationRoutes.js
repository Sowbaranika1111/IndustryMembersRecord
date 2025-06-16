const express = require("express");
const router = express.Router();
const {
  updateDesignation,
  getAllDesignations,
  deleteAllDesignations,
  insertBulkDesignations,
  // addNewCurrentRole,
  // deleteCurrentRoleById,
  // deleteAllCurrentRoles,
  // insertAllCurrentRoles,
} = require("../controllers/dropDownValuesController/designationController");

// GET existing current_role values
router.get("/getAllDesignations",getAllDesignations);
router.put("/updateDesignation/:id",updateDesignation); 

// POST new current_role
// router.post("/add", addNewCurrentRole);

// DELETE current_role by ID
// router.delete("/delete/:id", deleteCurrentRoleById);

// DELETE all roles at a time
router.delete("/deleteAllDesignations", deleteAllDesignations);

// BULK insert roles
router.post("/insertAllDesignations", insertBulkDesignations);

module.exports = router;
