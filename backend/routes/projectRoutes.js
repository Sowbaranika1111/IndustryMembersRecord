const express = require("express");
const router = express.Router();

const {
  getAllProjects,
  addSingleProject,
  updateProjectById,
  deleteProjectById,
  deleteAllProjects,
  bulkInsertProjects
} = require("../controllers/dropDownValuesController/projectController");

// GET all projects
router.get("/", getAllProjects);

// POST one project
router.post("/add-single", addSingleProject);

// PUT update existing project
router.put("/update/:id", updateProjectById);

// DELETE one project by ID
router.delete("/delete/:id", deleteProjectById);

// DELETE all projects
router.delete("/delete-all", deleteAllProjects);

// POST multiple projects
router.post("/insert-many", bulkInsertProjects);

module.exports = router;
