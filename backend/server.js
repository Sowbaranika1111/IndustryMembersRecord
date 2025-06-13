require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const loginRoutes = require("./routes/loginRoutes.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// API Routes
app.use("/api/login", loginRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));

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
//cloud-knowledge
const cloudKnowledgeRoutes = require("./routes/cloudKnowledgeRoutes");
app.use("/api/cloud-knowledge", cloudKnowledgeRoutes);


//project
const projectRoutes = require('./routes/projectRoutes');
app.use('/api/project-dropdown', projectRoutes);


//! Login Admin Routes

app.use('/api/login/',loginRoutes);
