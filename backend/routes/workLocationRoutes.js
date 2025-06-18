const express = require("express");
const router = express.Router();

const {
  
  updateWorkLocation,
  getAllWorkLocations,
  deleteAllWorkLocations,
  insertAllWorkLocations,
  
} = require("../controllers/dropDownValuesController/workLocationController");


router.put("/update/:id", updateWorkLocation); 
router.get("/",getAllWorkLocations);
router.delete("/delete-all",deleteAllWorkLocations);
router.post("/insert-many", insertAllWorkLocations);

module.exports = router;