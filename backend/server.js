// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

require("./db/dbconnect");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());




// Excel file route (optional)
const path = require('path');
app.get('/download/excel', (req, res) => {
  const file = path.join(__dirname, 'excel', 'batchmates.xlsx');
  res.download(file);
});

// DB Connection and Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//! Routes

//! batchmates route

const batchmateRoutes = require('./routes/batchmateRoutes');
app.use('/api/batchmates', batchmateRoutes);

//!dropdown values from mongodb routes

const currentRoleRoutes = require('./routes/currentRoleRoutes.js');
// const industryKnowledgeRoutes = require("./routes/industryKnowledgeRoutes.js");

app.use('/api/current-roles/', currentRoleRoutes);
// app.use("/api/indus-know-dropdown/", industryKnowledgeRoutes);
const workLocationRoutes = require('./routes/workLocationRoutes.js')
app.use('/api/work-location/', workLocationRoutes);

//! Login Admin Routes

const loginRoutes = require('./routes/loginRoutes.js');

app.use('/api/login/',loginRoutes);
