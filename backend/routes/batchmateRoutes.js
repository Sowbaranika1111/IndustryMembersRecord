// backend/routes/batchmates.js
const express = require('express');
const router = express.Router();
const {
  updateCurrentRole,
  addBatchmate,
  getAllBatchmates,
  searchBatchmateByName,
  updateBatchmate,
  getBatchmateById,
  getBatchmateByEmail,
  getBatchmateByEnterpriseId,
  deleteAllBatchmates
} = require('../controllers/batchmateController');

//updating current role based on drop down selected.
// router.put('/updateRole/:id', updateCurrentRole); 


// Add new
router.post('/add', addBatchmate);

// Get all
router.get('/', getAllBatchmates);

// Search
router.get('/search', searchBatchmateByName);

// Edit
router.put('/:name', updateBatchmate);

// get by id
router.get('/id/:id', getBatchmateById);  

// GET by email
router.get("/email", getBatchmateByEmail);

// GET by enterprise ID
router.get("/enterprise/:enterpriseId", getBatchmateByEnterpriseId);

// DELETE
router.delete("/delete-all", deleteAllBatchmates);

module.exports = router;
