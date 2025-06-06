const { IndustryKnowledge } = require("../../models/dropdownValuesModel.js");

// GET /api/dropdown/industry_knowledge
// http://localhost:5000/api/indus-know-dropdown/ GET

exports.getIndustryKnowledgeValues = async (req, res) => {
  try {
    const values = await IndustryKnowledge.find({
      category: "industry_knowledge",
    }).sort({
      id: 1,
    });
    res.json(values);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new industry knowledge
// http://localhost:5000/api/indus-know-dropdown/industry_knowledge POST {"value" : "Automotive"}

exports.addNewIndustryKnowledge = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ error: "Industry value is required." });
    }

    // Check if the same value already exists
    const exists = await IndustryKnowledge.findOne({
      category: "industry_knowledge",
      value: value,
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Industry knowledge already exists." });
    }

    // Find max ID for industry_knowledge category
    const lastEntry = await IndustryKnowledge.findOne({
      category: "industry_knowledge",
    }).sort({ id: -1 });

    const nextId = lastEntry ? lastEntry.id + 1 : 1;

    const newIndustry = new IndustryKnowledge({
      id: nextId,
      category: "industry_knowledge",
      value,
    });

    const saved = await newIndustry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a specific industry knowledge by ID
// http://localhost:5000/api/indus-know-dropdown/3 DELETE

exports.deleteIndustryKnowledgeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deleted = await IndustryKnowledge.findOneAndDelete({
      id,
      category: "industry_knowledge",
    });

    if (!deleted) {
      return res.status(404).json({ error: "Industry knowledge not found." });
    }

    res.json({ message: "Industry knowledge deleted successfully.", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//! DELETE ALL industry knowledge values
// http://localhost:5000/api/indus-know-dropdown/deleteall

exports.deleteAllIndustryKnowledge = async (req, res) => {
  try {
    // Count existing documents before deletion
    const existingCount = await IndustryKnowledge.countDocuments({
      category: "industry_knowledge",
    });

    if (existingCount === 0) {
      return res.status(200).json({
        message: "No industry knowledge values found to delete.",
        success: true,
        deletedCount: 0,
      });
    }

    // Delete all industry knowledge documents
    const deleteResult = await IndustryKnowledge.deleteMany({
      category: "industry_knowledge",
    });

    // Verify deletion was successful
    const remainingCount = await IndustryKnowledge.countDocuments({
      category: "industry_knowledge",
    });

    if (remainingCount > 0) {
      return res.status(500).json({
        error: "Deletion incomplete. Some documents may still exist.",
        success: false,
        deletedCount: deleteResult.deletedCount,
        remainingCount: remainingCount,
      });
    }

    res.status(200).json({
      message: `Successfully deleted all industry knowledge values.`,
      success: true,
      deletedCount: deleteResult.deletedCount,
      operation: "DELETE_ALL_INDUSTRY_KNOWLEDGE",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in deleteAllIndustryKnowledge:", err);

    res.status(500).json({
      error:
        "Internal server error occurred while deleting industry knowledge values.",
      success: false,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

//! BULK INSERT all industry knowledge values
// http://localhost:5000/api/indus-know-dropdown/bulk-insert
/*{
  "values": ["Automotive","Industrial","Aerospace","Medical Devices","Hitech","Resources","Consumer Goods","None","Several"]
}*/
exports.insertAllIndustryKnowledge = async (req, res) => {
  try {
    const { values } = req.body;

    // Validate input
    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        error: "Values must be a non-empty array.",
        success: false,
      });
    }

    // Normalize values - trim whitespace and filter out empty strings
    const inputValues = values
      .map((v) => {
        if (typeof v !== "string") {
          throw new Error(
            `Invalid value type: ${typeof v}. All values must be strings.`
          );
        }
        return v.trim();
      })
      .filter((v) => v.length > 0); // Remove empty strings after trimming

    if (inputValues.length === 0) {
      return res.status(400).json({
        error: "No valid values provided after filtering empty strings.",
        success: false,
      });
    }

    // Remove duplicates from input array
    const uniqueInputValues = [...new Set(inputValues)];

    // Check for existing values in the database
    const existingDocs = await IndustryKnowledge.find({
      category: "industry_knowledge",
      value: { $in: uniqueInputValues },
    });

    const existingValues = existingDocs.map((doc) => doc.value);
    const newValues = uniqueInputValues.filter(
      (val) => !existingValues.includes(val)
    );

    // Prepare response messages for existing values
    const existingMessages = existingValues.map(
      (value) => `Value "${value}" already exists`
    );

    // If no new values to insert
    if (newValues.length === 0) {
      return res.status(200).json({
        message:
          "No new values inserted. All provided values already exist in the database.",
        success: true,
        existingValues: existingMessages,
        totalProvided: uniqueInputValues.length,
        alreadyExists: existingValues.length,
        inserted: 0,
      });
    }

    // Find the highest existing ID for proper sequencing
    const lastEntry = await IndustryKnowledge.findOne({
      category: "industry_knowledge",
    }).sort({ id: -1 });

    let nextId = lastEntry ? lastEntry.id + 1 : 1;

    // Prepare documents for insertion
    const documents = newValues.map((value) => ({
      id: nextId++,
      category: "industry_knowledge",
      value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert new documents
    const inserted = await IndustryKnowledge.insertMany(documents);

    // Prepare success response
    const response = {
      message: `Successfully inserted ${inserted.length} new industry knowledge values.`,
      success: true,
      totalProvided: uniqueInputValues.length,
      inserted: inserted.length,
      alreadyExists: existingValues.length,
      insertedValues: inserted.map((doc) => doc.value),
    };

    // Include existing values info if any
    if (existingValues.length > 0) {
      response.existingValues = existingMessages;
      response.message += ` ${existingValues.length} values were already present in the database.`;
    }

    res.status(201).json(response);
  } catch (err) {
    console.error("Error in insertAllIndustryKnowledge:", err);

    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Duplicate key error: One or more values already exist.",
        success: false,
      });
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: `Validation error: ${err.message}`,
        success: false,
      });
    }

    // Generic error response
    res.status(500).json({
      error:
        "Internal server error occurred while inserting industry knowledge values.",
      success: false,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
