// backend/routes/batchmates.js
const express = require('express');
const router = express.Router();
const {
  addBatchmate,
  getAllBatchmates,
  searchBatchmateByName,
  updateBatchmate,
} = require('../controllers/batchmateController');

// Add new
router.post('/', addBatchmate);

// Get all
router.get('/', getAllBatchmates);

// Search
router.get('/search', searchBatchmateByName);

// Edit
router.put('/:id', updateBatchmate);

module.exports = router;
