// backend/clearDB.js
const mongoose = require('mongoose');
const Batchmate = require('./models/Batchmate');
 
mongoose.connect('mongodb://127.0.0.1:27017/batchmates_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  await Batchmate.deleteMany({});
  console.log('✅ Cleared all batchmate records');
  process.exit();
});
 