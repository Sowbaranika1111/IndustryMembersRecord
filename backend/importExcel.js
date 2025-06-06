// backend/importExcel.js
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const Batchmate = require('./models/Batchmate');

const filePath = path.resolve(__dirname, 'excel', 'IX_DS_Engineering_Resource_Skill_Matrix 1.xlsx');
const TARGET_SHEET_NAME = 'Resource';

function transformKey(key) {
  if (typeof key !== 'string') {
    return String(key);
  }
  return key
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

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

async function importData() {
  try {
    console.log(`🔄 Reading Excel file from: ${filePath}`);
    const workbook = xlsx.readFile(filePath, { cellDates: true });

    console.log('🔍 Available sheet names:', workbook.SheetNames);
    let sheet;
    let actualSheetName;

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

    if (!sheet) {
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
          } else if (typeof value === 'number') {
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
    console.log(`⏳ Importing ${formattedData.length} documents into MongoDB...`);
    await Batchmate.insertMany(formattedData, { ordered: false });
    console.log(`✅ Imported ${formattedData.length} rows from sheet "${actualSheetName}" into MongoDB.`);
  } catch (err) {
    console.error('❌ Error importing data:', err);
    if (err.writeErrors) {
      err.writeErrors.forEach(writeErr => {
        console.error(`   - Write Error Index: ${writeErr.index}, Code: ${writeErr.code}, Message: ${writeErr.errmsg}`);
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