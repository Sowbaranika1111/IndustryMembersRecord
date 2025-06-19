const express = require("express");
const router = express.Router();
const {
  
  getAllExpertise,
  deleteAllExpertise,
  insertAllExpertise

} = require("../controllers/dropDownValuesController/plmDevExpertiseController");

router.get("/",getAllExpertise);
// router.put("/updateDesignation/:id",updateDesignation); 

router.delete("/delete-all", deleteAllExpertise);

router.post("/insert-many", insertAllExpertise);

module.exports = router;
