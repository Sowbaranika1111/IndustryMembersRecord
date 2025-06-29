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
// router.post("/",createDesignation);
// router.delete("/:id",deleteDesignation);
router.delete("/delete-all", deleteAllDesignations);
// router.post("/insert-many", insertAllDesignations);
router.post("/insert-many", insertAllDesignations);

module.exports = router;
