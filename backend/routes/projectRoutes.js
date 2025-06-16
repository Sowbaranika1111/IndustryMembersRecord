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


router.delete('/deleteall', deleteAllProjects);

router.post('/bulk-insert', insertAllProjects);

module.exports = router;
