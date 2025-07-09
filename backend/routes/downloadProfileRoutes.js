const express = require('express');
const router = express.Router();
const { downloadBatchmateProfilePDF } = require('../controllers/downloadProfileController.js');

// GET /api/batchmates/download/:enterpriseid
router.get('/download/:enterpriseid', downloadBatchmateProfilePDF);

module.exports = router;
