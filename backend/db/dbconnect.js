require("dotenv").config(); // Load env vars at the top
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/batchmates_db';
// mongoose.connect(MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected successfully to:', MONGO_URI);
//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1); // Exit the app if DB connection fails
//   });

// module.exports = mongoose;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB Atlas connection error:", err);
    process.exit(1);
  });

module.exports = mongoose;
