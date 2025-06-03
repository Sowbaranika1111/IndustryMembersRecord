// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const batchmateRoutes = require('./routes/batchmateRoutes');
app.use('/api/batchmates', batchmateRoutes);

// Excel file route (optional)
const path = require('path');
app.get('/download/excel', (req, res) => {
  const file = path.join(__dirname, 'excel', 'batchmates.xlsx');
  res.download(file);
});

// DB Connection and Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully to:', process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));