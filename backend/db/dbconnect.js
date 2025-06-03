// db/dbconnect.js
const mongoose = require("mongoose");

const dburl = "mongodb://127.0.0.1:27017/teammates_records";

mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((e) => {
    console.log("Error in connecting to db:", e);
  });

module.exports = mongoose;