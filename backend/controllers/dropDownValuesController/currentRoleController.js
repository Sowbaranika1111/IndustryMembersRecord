// const { CurrentRole } = require("../../models/dropdownValuesModel.js");
const { CurrentRole } = require("../../models/dropdownValuesModel.js");
const Batchmate = require("../../models/Batchmate.js");


//! Get all current roles
// http://localhost:5000/api/current-role/ GET

const getAllCurrentRoles = async (req, res) => {
  try {
    // find({}) fetches all documents in the collection
    const roles = await CurrentRole.find({});

    // Send a success response with the fetched roles
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching current roles:", error);
    res.status(500).json({ message: "Server error while fetching roles" });
  }
};

// for updating the currentrole in the ui and and updating the current role in db if it does not exist

const updateCurrentRole = async (req, res) => {
  try {
    // 1. Get the ID of the batchmate from the URL parameters
    const batchmateId = req.params.id; // (Note: unused in current logic)

    // 2. Extract role value from request body
    const { value } = req.body;

    // 3. Validate input
    if (!value) {
      return res.status(400).json({
        error: "Role value is required.",
        success: false,
      });
    }

    if (typeof value !== "string") {
      return res.status(400).json({
        error: `Invalid value type: ${typeof value}. Role value must be a string.`,
        success: false,
      });
    }

    const normalizedValue = value.trim();
    if (normalizedValue.length === 0) {
      return res.status(400).json({
        error: "Role value cannot be empty or contain only whitespace.",
        success: false,
      });
    }

    // 4. Check for existing role (case-insensitive)
    const existingRole = await CurrentRole.findOne({
      value: { $regex: new RegExp(`^${normalizedValue}$`, "i") },
    });

    if (existingRole) {
      return res.status(409).json({
        error: `Value "${normalizedValue}" already exists in the database.`,
        success: false,
        existingRole: {
          id: existingRole._id,
          value: existingRole.value,
          createdAt: existingRole.createdAt,
        },
      });
    }

    // 5. Create and save new role
    const newRole = new CurrentRole({
      value: normalizedValue,
    });

    const saved = await newRole.save();

    // 6. Send response
    res.status(201).json({
      message: `Successfully added new current role: "${normalizedValue}".`,
      success: true,
      role: {
        id: saved._id,
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

//! DELETE a current role by ID - route removed - check the code 
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
//! INSERT one/many current roles
// http://localhost:5000/api/current-role/insert-many POST {"value" : ["Dev","value1","value2"]}

const insertAllCurrentRoles = async (req, res) => {
  try {
    // 1. VALIDATE INPUT: Expects { value: [ ... ] }
    const { value } = req.body;

    if (!Array.isArray(value) || value.length === 0) {
      return res.status(400).json({
        success: false,
        error:
          "Request body must contain a non-empty 'value' array of role names.",
      });
    }

    // 2. NORMALIZE DATA: Trim, remove empty strings, ensure uniqueness
    const uniqueInputValues = [
      ...new Set(value.map((v) => String(v).trim()).filter(Boolean)),
    ];

    if (uniqueInputValues.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid role names provided after filtering.",
      });
    }

    // 3. CHECK FOR DUPLICATES in DB
    const existingDocs = await CurrentRole.find({
      value: { $in: uniqueInputValues },
    });

    const existingValues = new Set(existingDocs.map((doc) => doc.value));

    // 4. FILTER NEW ROLES
    const newValuesToInsert = uniqueInputValues.filter(
      (val) => !existingValues.has(val)
    );
    const alreadyExistCount =
      uniqueInputValues.length - newValuesToInsert.length;

    if (newValuesToInsert.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new roles were added as all provided roles already exist.",
        totalProvided: uniqueInputValues.length,
        inserted: 0,
        alreadyExists: alreadyExistCount,
      });
    }

    // 5. INSERT NEW ROLES
    const documentsToInsert = newValuesToInsert.map((value) => ({ value }));
    const inserted = await CurrentRole.insertMany(documentsToInsert);

    // 6. RESPOND
    res.status(201).json({
      success: true,
      message: `Successfully added ${inserted.length} new role(s).`,
      totalProvided: uniqueInputValues.length,
      inserted: inserted.length,
      alreadyExists: alreadyExistCount,
      insertedValues: inserted.map((doc) => doc.value),
    });
  } catch (err) {
    console.error("Error in insertAllCurrentRoles:", err);
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
};
