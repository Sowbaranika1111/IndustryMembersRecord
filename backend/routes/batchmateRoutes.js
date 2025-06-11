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
} = require('../controllers/batchmateController');

//updating current role based on drop down selected.
// router.put('/updateRole/:id', updateCurrentRole); 


// Add new
router.post('/', addBatchmate);

// Get all
router.get('/', getAllBatchmates);

// Search
router.get('/search', searchBatchmateByName);

// Edit
router.put('/:name', updateBatchmate);

// get by id
router.get('/id/:id', getBatchmateById);  

module.exports = router;
