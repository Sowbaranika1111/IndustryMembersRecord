const { PLMSapExpertise } = require("../../models/dropdownValuesModel");



//get


const getAllExpertise = async (req, res) => {
  try {
    const expertises = await PLMSapExpertise.find({});

    if (!expertises || expertises.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No expertise entries found",
      });
    }

    res.status(200).json({
      success: true,
      count: expertises.length,
      data: expertises,
    });

  } catch (error) {
    console.error("Error in getAllExpertise:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//deleteALL


const deleteAllExpertise = async (req, res) => {
  try {
    const deletionResult = await PLMSapExpertise.deleteMany({});

    if (deletionResult.deletedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No expertise entries to delete.",
        deletedCount: 0,
      });
    }

    res.status(200).json({
      success: true,
      message: `Deleted all ${deletionResult.deletedCount} expertise entries.`,
      deletedCount: deletionResult.deletedCount,
    });

  } catch (error) {
    console.error("Error in deleteAllExpertise:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//insertALL


const insertAllExpertise = async (req, res) => {
  try {
    const values = req.body;

    // 1. Validate input
    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of expertise names.",
      });
    }

    // 2. Normalize & deduplicate
    const uniqueInputValues = [...new Set(
      values.map(v => String(v).trim()).filter(Boolean)
    )];

    if (uniqueInputValues.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid expertise names provided after filtering.",
      });
    }

    // 3. Check for existing entries (✔️ fixed from 'name' to 'value')
    const existingDocs = await PLMSapExpertise.find({ value: { $in: uniqueInputValues } });
    const existingValues = new Set(existingDocs.map(doc => doc.value));

    // 4. Filter only new values
    const newValuesToInsert = uniqueInputValues.filter(val => !existingValues.has(val));
    const alreadyExistCount = uniqueInputValues.length - newValuesToInsert.length;

    // 5. If no new values, respond early
    if (newValuesToInsert.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new entries added, all provided expertise already exist.",
        totalProvided: uniqueInputValues.length,
        inserted: 0,
        alreadyExists: alreadyExistCount,
      });
    }

    // 6. Prepare and insert new documents
    const documentsToInsert = newValuesToInsert.map(value => ({ value }));
    const inserted = await PLMSapExpertise.insertMany(documentsToInsert);

    // 7. Send final response
    res.status(201).json({
      success: true,
      message: `Added ${inserted.length} new expertise entries.`,
      totalProvided: uniqueInputValues.length,
      inserted: inserted.length,
      alreadyExists: alreadyExistCount,
      insertedValues: inserted.map(doc => doc.value),
    });

  } catch (err) {
    console.error("Error in insertAllExpertise:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error while adding expertise entries.",
    });
  }
};


module.exports = {

  getAllExpertise,
  deleteAllExpertise,
  insertAllExpertise
};