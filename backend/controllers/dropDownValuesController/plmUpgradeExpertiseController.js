const { PlmUpgradeExpertise } = require("../../models/dropdownValuesModel.js");

// GET all upgrade expertise entries
const getAllUpgradeExpertise = async (req, res) => {
  try {
    const upgrades = await PlmUpgradeExpertise.find({});

    if (!upgrades || upgrades.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No PLM upgrade expertise entries found.",
      });
    }

    res.status(200).json({
      success: true,
      count: upgrades.length,
      data: upgrades,
    });

  } catch (error) {
    console.error("Error in getAllUpgradeExpertise:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching PLM upgrade expertise.",
    });
  }
};

// DELETE all upgrade expertise entries
const deleteAllUpgradeExpertise = async (req, res) => {
  try {
    const result = await PlmUpgradeExpertise.deleteMany({});

    if (result.deletedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No PLM upgrade expertise entries to delete.",
        deletedCount: 0,
      });
    }

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} PLM upgrade expertise entries.`,
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    console.error("Error in deleteAllUpgradeExpertise:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting PLM upgrade expertise.",
    });
  }
};

// BULK INSERT for upgrade expertise
const insertAllUpgradeExpertise = async (req, res) => {
  try {
    const values = req.body;

    // 1. Validate input
    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of upgrade expertise names.",
      });
    }

    // 2. Normalize & remove empty values
    const uniqueInputValues = [...new Set(
      values.map(v => String(v).trim()).filter(Boolean)
    )];

    if (uniqueInputValues.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid upgrade expertise names provided.",
      });
    }

    // 3. Check for duplicates
    const existingDocs = await PlmUpgradeExpertise.find({ value: { $in: uniqueInputValues } });
    const existingValues = new Set(existingDocs.map(doc => doc.value));

    // 4. Filter out already existing entries
    const newValues = uniqueInputValues.filter(val => !existingValues.has(val));
    const alreadyExistsCount = uniqueInputValues.length - newValues.length;

    // 5. Early response if nothing to insert
    if (newValues.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new entries added. All upgrade expertise already exist.",
        totalProvided: uniqueInputValues.length,
        inserted: 0,
        alreadyExists: alreadyExistsCount,
      });
    }

    // 6. Insert new upgrade entries
    const docsToInsert = newValues.map(value => ({ value }));
    const inserted = await PlmUpgradeExpertise.insertMany(docsToInsert);

    // 7. Final response
    res.status(201).json({
      success: true,
      message: `Added ${inserted.length} new PLM upgrade expertise entries.`,
      totalProvided: uniqueInputValues.length,
      inserted: inserted.length,
      alreadyExists: alreadyExistsCount,
      insertedValues: inserted.map(doc => doc.value),
    });

  } catch (error) {
    console.error("Error in insertAllUpgradeExpertise:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while inserting PLM upgrade expertise.",
    });
  }
};

module.exports = {
  getAllUpgradeExpertise,
  deleteAllUpgradeExpertise,
  insertAllUpgradeExpertise
};
