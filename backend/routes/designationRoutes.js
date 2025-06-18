const express = require("express");
const router = express.Router();
const {
  updateDesignation,
  getAllDesignations,
  deleteAllDesignations,
  insertAllDesignations,

} = require("../controllers/dropDownValuesController/designationController");

router.get("/",getAllDesignations);
router.put("/update/:id",updateDesignation); 

// DELETE current_role by ID
// router.delete("/delete/:id", deleteCurrentRoleById);

router.delete("/delete-all", deleteAllDesignations);

router.post("/insert-many", insertAllDesignations);

module.exports = router;
