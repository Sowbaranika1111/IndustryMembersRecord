const express = require('express');
const router = express.Router();
const {
  getCurrentValuesByCategory,
  addNewCurrentRole,
  deleteCurrentRoleById,
  insertAllCurrentRoles
} = require('../controllers/dropDownValuesController/currentRoleController');

// GET existing current_role values
router.get('/current_role', getCurrentValuesByCategory);

// POST new current_role
router.post('/current_role', addNewCurrentRole);

// DELETE current_role by ID
router.delete('/current_role/:id', deleteCurrentRoleById);

// BULK insert roles
// router.post('/current_role/bulk', insertAllCurrentRoles);
module.exports = router;
