// const { CurrentRole } = require("../../models/dropdownValuesModel.js");
const {CurrentRole} = require('../../models/dropdownValuesModel.js')
const Batchmate = require('../../models/Batchmate.js');

//! GET
// http://localhost:5000/api/current-roles/getAllCurrentRoles GET

// exports.getAllCurrentRoles = async (req, res) => {
//   try {
//     const roles = await CurrentRole.find({
//       category: "current_role",
//     }).sort({ id: 1 });

//     res.status(200).json({
//       message: "Successfully retrieved all current roles.",
//       success: true,
//       count: roles.length,
//       roles: roles,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (err) {
//     console.error("Error in getAllCurrentRoles:", err);

//     res.status(500).json({
//       error: "Internal server error occurred while retrieving current roles.",
//       success: false,
//       details: process.env.NODE_ENV === "development" ? err.message : undefined,
//     });
//   }
// };

//! Add new current role
// http://localhost:5000/api/current-role-dropdown/add POST {"value" : "Dev"}


//! Get all current roles
// http://localhost:5000/api/current-roles/getAllCurrentRoles GET

const getAllCurrentRoles = async (req, res) => {
  try {
    // find({}) fetches all documents in the collection
    const roles = await CurrentRole.find({});
    
    // Send a success response with the fetched roles
    res.status(200).json(roles);

  } catch (error) {
    console.error('Error fetching current roles:', error);
    res.status(500).json({ message: 'Server error while fetching roles' });
  }
};


// for updating the currentrole in the ui and and updating the current role in db if it does not exist

   const updateCurrentRole = async (req, res) => {
  try {
    // 1. Get the ID of the batchmate from the URL parameters
    const batchmateId = req.params.id;

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

    let nextId = lastEntry ? lastEntry.id + 1 : 1;

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

//! DELETE a current role by ID - route removed
// http://localhost:5000/api/current-role-dropdown/delete/3 Delete
exports.deleteCurrentRoleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

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

//! BULK DELETE all current roles

const deleteAllCurrentRoles = async (req, res) => {
  try {
    // 1. Call the database logic to delete all documents in the collection.
    // The result object contains information like `deletedCount`.
    const deletionResult = await CurrentRole.deleteMany({});

    // 2. Check how many documents were deleted to provide an accurate response.
    if (deletionResult.deletedCount === 0) {
      // This is not an error, but it's good to inform the user that nothing needed to be done.
      return res.status(200).json({
        success: true,
        message: "No roles to delete. The collection was already empty.",
        deletedCount: 0,
      });
    }

    // 3. Send a clear SUCCESS response confirming the deletion.
    res.status(200).json({
      success: true,
      message: `Successfully deleted all ${deletionResult.deletedCount} roles.`,
      deletedCount: deletionResult.deletedCount,
    });

  } catch (err) {
    // 4. If any unexpected server or database error occurs, this block will run.
    console.error("Error in deleteAllRoles:", err);

    // 5. Send a generic 500 Internal Server Error response.
    res.status(500).json({
      success: false,
      error: "An internal server error occurred while deleting roles.",
    });
  }
};
//! BULK INSERT all current roles
// http://localhost:5000/api/current-roles/insertAllCurrentRoles/ POST {"value" : ["Dev","value1","value2"]}



const insertAllCurrentRoles = async (req, res) => {
  try {
    // 1. VALIDATE INPUT: Expects a simple array of strings.
    const values = req.body;
    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of role names.",
      });
    }

    // 2. NORMALIZE DATA: Clean up the input by trimming whitespace,
    // filtering out empty values, and keeping only unique role names.
    const uniqueInputValues = [...new Set(
        values.map(v => String(v).trim()).filter(Boolean)
    )];

    if (uniqueInputValues.length === 0) {
      return res.status(400).json({ success: false, error: "No valid role names provided after filtering." });
    }

    // 3. CHECK FOR DUPLICATES: Efficiently find which of the roles
    // already exist in the database.
    const existingDocs = await CurrentRole.find({ value: { $in: uniqueInputValues } });
    const existingValues = new Set(existingDocs.map(doc => doc.value));

    // 4. PREPARE NEW ROLES: Filter the input to get only the roles
    // that are genuinely new.
    const newValuesToInsert = uniqueInputValues.filter(val => !existingValues.has(val));
    const alreadyExistCount = uniqueInputValues.length - newValuesToInsert.length;

    // If there are no new roles to add, we're done. This is a success.
    if (newValuesToInsert.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new roles were added as all provided roles already exist.",
        totalProvided: uniqueInputValues.length,
        inserted: 0,
        alreadyExists: alreadyExistCount,
      });
    }

    // 5. INSERT: Prepare the new documents and insert them in one go.
    const documentsToInsert = newValuesToInsert.map(value => ({ value }));
    const inserted = await CurrentRole.insertMany(documentsToInsert);

    // 6. RESPOND: Send a clear, detailed success response.
    res.status(201).json({
      success: true,
      message: `Successfully added ${inserted.length} new role(s).`,
      totalProvided: uniqueInputValues.length,
      inserted: inserted.length,
      alreadyExists: alreadyExistCount,
      insertedValues: inserted.map(doc => doc.value),
    });

  } catch (err) {
    // This will now only catch unexpected server errors, making it very clean.
    console.error("Error in addRoles:", err);
    res.status(500).json({
      success: false,
      error: "An internal server error occurred.",
    });
  }
};

module.exports = {
  getAllCurrentRoles,
  deleteAllCurrentRoles,
  insertAllCurrentRoles,
  updateCurrentRole,
}
