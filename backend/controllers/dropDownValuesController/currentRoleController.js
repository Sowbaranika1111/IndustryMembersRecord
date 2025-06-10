const { CurrentRole } = require("../../models/dropdownValuesModel.js");

// GET /api/dropdown/current_role
// http://localhost:5000/api/current-role-dropdown/ GET

// OPTIONAL: Get all current roles (for reference)
exports.getAllCurrentRoles = async (req, res) => {
  try {
    const roles = await CurrentRole.find({
      category: "current_role",
    }).sort({ id: 1 });

    res.status(200).json({
      message: "Successfully retrieved all current roles.",
      success: true,
      count: roles.length,
      roles: roles,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in getAllCurrentRoles:", err);

    res.status(500).json({
      error: "Internal server error occurred while retrieving current roles.",
      success: false,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Add new current role
// http://localhost:5000/api/current-role-dropdown/add POST {"value" : "Dev"}

exports.addNewCurrentRole = async (req, res) => {
  try {
    const { value } = req.body;

    // Validate input
    if (!value) {
      return res.status(400).json({
        error: "Role value is required.",
        success: false,
      });
    }

    // Validate that value is a string
    if (typeof value !== "string") {
      return res.status(400).json({
        error: `Invalid value type: ${typeof value}. Role value must be a string.`,
        success: false,
      });
    }

    // Normalize the value - trim whitespace
    const normalizedValue = value.trim();

    // Check if value is empty after trimming
    if (normalizedValue.length === 0) {
      return res.status(400).json({
        error: "Role value cannot be empty or contain only whitespace.",
        success: false,
      });
    }

    // Check if the role already exists (case-insensitive check)
    const existingRole = await CurrentRole.findOne({
      category: "current_role",
      value: { $regex: new RegExp(`^${normalizedValue}$`, "i") },
    });

    if (existingRole) {
      return res.status(409).json({
        error: `Value "${normalizedValue}" already exists in the database.`,
        success: false,
        existingRole: {
          id: existingRole.id,
          value: existingRole.value,
          createdAt: existingRole.createdAt,
        },
      });
    }

    // Find the highest existing ID for proper sequencing
    const lastEntry = await CurrentRole.findOne({
      category: "current_role",
    }).sort({ id: -1 });

    const nextId = lastEntry ? lastEntry.id + 1 : 1;

    // Create new role document
    const newRole = new CurrentRole({
      id: nextId,
      category: "current_role",
      value: normalizedValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save the new role
    const saved = await newRole.save();

    // Return success response
    res.status(201).json({
      message: `Successfully added new current role: "${normalizedValue}".`,
      success: true,
      role: {
        id: saved.id,
        category: saved.category,
        value: saved.value,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      },
      operation: "ADD_CURRENT_ROLE",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in addNewCurrentRole:", err);

    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Duplicate key error: This role value already exists.",
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

    // Handle cast errors (invalid ObjectId, etc.)
    if (err.name === "CastError") {
      return res.status(400).json({
        error: `Invalid data format: ${err.message}`,
        success: false,
      });
    }

    // Generic error response
    res.status(500).json({
      error: "Internal server error occurred while adding the current role.",
      success: false,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// DELETE a current role by ID
// http://localhost:5000/api/current-role-dropdown/delete/3 Delete
exports.deleteCurrentRoleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deletedRole = await CurrentRole.findOneAndDelete({
      id,
      category: "current_role",
    });

    if (!deletedRole) {
      return res.status(404).json({ error: "Role not found." });
    }

    res.json({ message: "Role deleted successfully.", deletedRole });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//! BULK DELETE all current roles
// http://localhost:5000/api/current-role-dropdown/deleteall 

exports.deleteAllCurrentRoles = async (req, res) => {
  try {
    // Count existing documents before deletion
    const existingCount = await CurrentRole.countDocuments({
      category: "current_role",
    });

    if (existingCount === 0) {
      return res.status(200).json({
        message: "No current role values found to delete.",
        success: true,
        deletedCount: 0,
      });
    }

    // Delete all current role documents
    const deleteResult = await CurrentRole.deleteMany({
      category: "current_role",
    });

    // Verify deletion was successful
    const remainingCount = await CurrentRole.countDocuments({
      category: "current_role",
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
      message: `Successfully deleted all current role values.`,
      success: true,
      deletedCount: deleteResult.deletedCount,
      operation: "DELETE_ALL_CURRENT_ROLES",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in deleteAllCurrentRoles:", err);

    res.status(500).json({
      error:
        "Internal server error occurred while deleting current role values.",
      success: false,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

//! BULK INSERT all current roles
// http://localhost:5000/api/current-role-dropdown/bulk-insert/ POST {"value" : ["Dev","value1","value2"]}

exports.insertAllCurrentRoles = async (req, res) => {
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

    // Check for existing values in the database (case-insensitive)
    const existingDocs = await CurrentRole.find({
      category: "current_role",
      value: {
        $in: uniqueInputValues.map(
          (val) =>
            new RegExp(`^${val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")
        ),
      },
    });

    const existingValues = existingDocs.map((doc) => doc.value);

    // Filter out values that already exist (case-insensitive comparison)
    const newValues = uniqueInputValues.filter(
      (val) =>
        !existingValues.some(
          (existing) => existing.toLowerCase() === val.toLowerCase()
        )
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
    const lastEntry = await CurrentRole.findOne({
      category: "current_role",
    }).sort({ id: -1 });

    let nextId = lastEntry ? lastEntry.id + 1 : 1;

    // Prepare documents for insertion
    const documents = newValues.map((value) => ({
      id: nextId++,
      category: "current_role",
      value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert new documents
    const inserted = await CurrentRole.insertMany(documents);

    // Prepare success response
    const response = {
      message: `Successfully inserted ${inserted.length} new current role values.`,
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
    console.error("Error in insertAllCurrentRoles:", err);

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
        "Internal server error occurred while inserting current role values.",
      success: false,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
