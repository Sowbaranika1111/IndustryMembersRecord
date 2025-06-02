// backend/importExcel.js
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const Batchmate = require('./models/Batchmate'); // Make sure this model has strict: false
 
const filePath = path.resolve(__dirname, 'excel', 'IX_DS_Engineering_Resource_Skill_Matrix 1.xlsx');
const TARGET_SHEET_NAME = 'Resource'; // <--- CHANGE THIS to the exact name of your sheet
 
// --- Helper function to transform Excel column names to MongoDB-friendly field names ---
function transformKey(key) {
  if (typeof key !== 'string') {
    return String(key); // Ensure key is a string
  }
  return key
    .trim() // Remove leading/trailing whitespace
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '_') // Replace spaces and multiple spaces with a single underscore
    .replace(/[^a-z0-9_]/g, ''); // Remove any character that is not a letter, number, or underscore
}
 
 
// 1. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/batchmates_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  importData();
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
 
// 2. Read Excel and insert into MongoDB
async function importData() {
  try {
    console.log(`🔄 Reading Excel file from: ${filePath}`);
    const workbook = xlsx.readFile(filePath, { cellDates: true });
 
    // --- MODIFICATION: Select the target sheet ---
    console.log('🔍 Available sheet names:', workbook.SheetNames);
    let sheet;
    let actualSheetName;
 
    // Try to find the sheet by the TARGET_SHEET_NAME, case-insensitively
    const foundSheetName = workbook.SheetNames.find(
      name => name.toLowerCase() === TARGET_SHEET_NAME.toLowerCase()
    );
 
    if (foundSheetName) {
      sheet = workbook.Sheets[foundSheetName];
      actualSheetName = foundSheetName;
      console.log(`🎯 Using sheet: "${actualSheetName}"`);
    } else {
      console.error(`❌ Sheet named "${TARGET_SHEET_NAME}" not found in the workbook.`);
      console.log(`👉 Please ensure the sheet name in your Excel file matches "${TARGET_SHEET_NAME}" (case might matter depending on exact library behavior, but we tried case-insensitive lookup).`);
      console.log(`Available sheets are: ${workbook.SheetNames.join(', ')}`);
      process.exit(1);
    }
    // --- END OF MODIFICATION ---
 
    if (!sheet) { // Should be caught by the check above, but good for safety
        console.error(`❌ Sheet "${actualSheetName || TARGET_SHEET_NAME}" could not be loaded.`);
        process.exit(1);
    }
 
    const jsonData = xlsx.utils.sheet_to_json(sheet, { raw: false, defval: '' });
 
    if (jsonData.length === 0) {
        console.log(`🟡 No data found in the sheet "${actualSheetName}".`);
        process.exit(0);
    }
 
    console.log(`📄 Found ${jsonData.length} rows in the sheet "${actualSheetName}".`);
 
    const formattedData = jsonData.map((row, rowIndex) => {
      const newRow = {};
      for (const originalKey in row) {
        if (Object.prototype.hasOwnProperty.call(row, originalKey)) {
          const transformedKey = transformKey(originalKey);
          let value = row[originalKey];
 
          if (value === undefined || value === null) {
            value = '';
          } else if (value instanceof Date) {
            // Keep as Date object
          } else if (typeof value === 'number') {
            // Keep as number
          } else {
            value = String(value).trim();
          }
 
          if (transformedKey) {
            newRow[transformedKey] = value;
          } else {
            console.warn(`⚠️ Row ${rowIndex + 1} in sheet "${actualSheetName}": Original key "${originalKey}" resulted in an empty transformed key. Skipping this field.`);
          }
        }
      }
      return newRow;
    });
 
    if (formattedData.length > 0) {
        console.log('📊 Example of formatted data (first row):', JSON.stringify(formattedData[0], null, 2));
    }
 
    // Optional: Clear existing data
    // console.log('🗑️ Clearing existing data from Batchmate collection...');
    // await Batchmate.deleteMany({});
    // console.log('✅ Existing data cleared.');
 
    console.log(`⏳ Importing ${formattedData.length} documents into MongoDB...`);
    await Batchmate.insertMany(formattedData, { ordered: false });
    console.log(`✅ Imported ${formattedData.length} rows from sheet "${actualSheetName}" into MongoDB.`);
 
  } catch (err) {
    console.error('❌ Error importing data:', err);
    if (err.writeErrors) {
      err.writeErrors.forEach(writeErr => {
        console.error(`   - Write Error Index: ${writeErr.index}, Code: ${writeErr.code}, Message: ${writeErr.errmsg}`);
        // Be careful logging entire problematic document if it contains sensitive data
        // console.error(`     Problematic Document: ${JSON.stringify(formattedData[writeErr.index])}`);
      });
    }
    process.exitCode = 1;
  } finally {
    console.log(' closing MongoDB connection...');
    await mongoose.disconnect();
    console.log(' MongoDB connection closed.');
    process.exit(process.exitCode || 0);
  }
}
 