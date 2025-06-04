// backend/routes/batchmates.js
const express = require('express');
const router = express.Router();
const {
  addBatchmate,
  getAllBatchmates,
  searchBatchmateByName,
  updateBatchmate,
  getBatchmateById
} = require('../controllers/batchmateController');

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
