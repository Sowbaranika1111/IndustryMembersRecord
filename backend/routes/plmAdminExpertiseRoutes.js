const express = require("express");
const router = express.Router();
const {
  
  getAllExpertise,
  deleteAllExpertise,
  insertAllExpertise
} = require("../controllers/dropDownValuesController/plmAdminExpertiseController");

router.get("/",getAllExpertise);

router.delete("/delete-all", deleteAllExpertise);

router.post("/insert-many", insertAllExpertise);

module.exports = router;
