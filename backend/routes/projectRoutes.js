const express = require('express');
const router = express.Router();

const {
  getAllProjects,
  addProject,
  deleteProjectById,
  deleteAllProjects,
  insertAllProjects
} = require('../controllers/dropDownValuesController/projectController');


router.get('/', getAllProjects);


router.post('/add', addProject);


router.delete('/delete/:id', deleteProjectById);


router.delete('/delete-all', deleteAllProjects);

router.post('/insert-many', insertAllProjects);

module.exports = router;
