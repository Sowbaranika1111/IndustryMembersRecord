// backend/controllers/batchmateController.js
const Batchmate = require('../models/Batchmate.js');

// Add new batchmate
// Update in backend/controllers/batchmateController.js
const { appendToExcel } = require('../utils/excelHandler');

exports.addBatchmate = async (req, res) => {
  try {
    const batchmate = new Batchmate(req.body);
    const saved = await batchmate.save();

    // Append to Excel
    appendToExcel(saved);

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all batchmates
exports.getAllBatchmates = async (req, res) => {
  try {
    const batchmates = await Batchmate.find();
    res.json(batchmates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search by name
exports.searchBatchmateByName = async (req, res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i'); // case-insensitive match
    const results = await Batchmate.find({ name: regex });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit batchmate
exports.updateBatchmate = async (req, res) => {
  try {
    const updated = await Batchmate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
