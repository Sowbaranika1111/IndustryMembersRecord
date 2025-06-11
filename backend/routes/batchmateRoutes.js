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

// DELETE
router.delete("/delete-all", deleteAllBatchmates);

module.exports = router;
