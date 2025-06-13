const express = require('express');
const router = express.Router();

const {
  getAllProjects,
  addProject,
  deleteProjectById,
  deleteAllProjects
} = require('../controllers/dropDownValuesController/projectController');


router.get('/', getAllProjects);


router.post('/add', addProject);


router.delete('/delete/:id', deleteProjectById);


router.delete('/deleteall', deleteAllProjects);

module.exports = router;
