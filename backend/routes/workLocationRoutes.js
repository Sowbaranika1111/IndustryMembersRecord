const express = require("express");
const router = express.Router();

const {
  
  updateWorkLocation,
  getAllWorkLocations,
  deleteAllWorkLocations,
  insertAllWorkLocations,
  addSingleWorkLocation,
  updateWorkLocationById,
  deleteWorkLocationById, 

} = require("../controllers/dropDownValuesController/workLocationController");


// router.put("/update/:id", updateWorkLocation); 
router.get("/",getAllWorkLocations);
router.delete("/delete-all",deleteAllWorkLocations);
router.post("/insert-many", insertAllWorkLocations);

router.post("/add-single", addSingleWorkLocation);
router.put("/update/:id", updateWorkLocationById);
router.delete("/delete/:id", deleteWorkLocationById);




module.exports = router;