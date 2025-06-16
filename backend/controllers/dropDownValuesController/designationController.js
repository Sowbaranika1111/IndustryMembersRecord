const {Designation} = require("../../models/dropdownValuesModel");
const Batchmate = require('../../models/Batchmate');

const updateDesignation = async (req, res) => {
  try {
    // 1. Get the ID of the batchmate from the URL parameters
    const batchmateId = req.params.id;

    // 2. Get the new designation string from the request's body.
    const { designation } = req.body;

    // Validate input
    if (!designation) {
      return res.status(400).json({
        success: false,
        message: 'A designation string is required in the request body',
      });
    }

    // --- SMART LOGIC STARTS HERE ---
    // 3. Check if this Designation already exists in the `Designations` collection.
    // We search by the 'name' field from our recommended schema.
    let designationExists = await Designation.findOne({ name: designation });
    let wasDesignationCreated = false;

    // 4. If the Designation does NOT exist, create it.
    if (!designationExists) {
      console.log(`Designation "${designation}" not found. Creating it now...`);

      // Find the highest existing numeric 'id' to generate a new unique one.
      const lastDesignation = await Designation.findOne().sort({ id: -1 });
      const newId = lastDesignation ? lastDesignation.id + 1 : 1;

      // Create the new Designation document in the 'Designations' collection
      await Designation.create({
        id: newId,
        name: designation, // Using 'name' as defined in our schema
      });
      wasDesignationCreated = true;
      console.log(`Successfully created new Designation: "${designation}"`);
    }
    // --- SMART LOGIC ENDS HERE ---

    // 5. Now, update the batchmate with the new designation string.
    // Assuming the field in the Batchmate model is also called 'designation'.
    const updatedBatchmate = await Batchmate.findByIdAndUpdate(
      batchmateId,
      { designation: designation }, // The data to update
      { new: true, runValidators: true } // Options: return the updated doc and run schema validators
    );

    // Check if the batchmate was found
    if (!updatedBatchmate) {
      return res.status(404).json({
        success: false,
        message: `Batchmate not found with id: ${batchmateId}`,
      });
    }

    // 6. Send a successful response with a clear message.
    res.status(200).json({
      success: true,
      // The message dynamically changes based on whether a new designation was created.
      message: `Batchmate Designation updated. ${wasDesignationCreated ? 'A new Designation was also created in the database.' : ''}`.trim(),
      data: updatedBatchmate,
    });

  } catch (error) {
    console.error('Error in updateDesignation handler:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

//getAllDesignations

const getAllDesignations = async (req, res) => {
  try {
    // 1. Call your database logic to fetch the data from the 'designations' collection
    const designations = await Designation.find({});

    // 2. Check if any designations were found (optional but good practice)
    if (!designations || designations.length === 0) {
      // Respond with 404 Not Found if the collection is empty
      return res.status(404).json({
        success: false,
        message: "No designations found",
      });
    }

    // 3. Send a SUCCESS response
    // Status 200 means OK.
    // We send a JSON object containing the data.
    res.status(200).json({
      success: true,
      count: designations.length,
      data: designations,
    });

  } catch (error) {
    // 4. If any error occurs in the 'try' block, this 'catch' block will run
    console.error("Server Error in getAllDesignations:", error);

    // 5. Send an ERROR response
    // Status 500 means Internal Server Error.
    // We send a generic error message to the client for security.
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//Deleting all the Designations

const deleteAllDesignations = async (req, res) => {
  try {
    // 1. Call the database logic to delete all documents.
    // The result object contains info like `deletedCount`.
    const deletionResult = await Designation.deleteMany({});

    // 2. Check how many documents were deleted.
    if (deletionResult.deletedCount === 0) {
      // This is a success case, but we inform the user the collection was already empty.
      return res.status(200).json({
        success: true,
        message: "No designations found to delete. The collection was already empty.",
        deletedCount: 0,
      });
    }

    // 3. Send a SUCCESS response confirming the deletion.
    res.status(200).json({
      success: true,
      message: `Successfully deleted all ${deletionResult.deletedCount} designations.`,
      deletedCount: deletionResult.deletedCount,
    });

  } catch (error) {
    // 4. If any database error occurs, this 'catch' block will run.
    console.error("Server Error in deleteAllDesignations:", error);

    // 5. Send an ERROR response.
    res.status(500).json({
      success: false,
      message: "Internal Server Error while trying to delete designations.",
    });
  }
};

//inserting bulk designations
const insertAllDesignations = async (req, res) => {
  try {
    // 1. VALIDATE INPUT: Expects a simple array of strings.
    const values = req.body;
    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of designation names.",
      });
    }

    // 2. NORMALIZE DATA: Clean up the input by trimming whitespace,
    // filtering out empty values, and keeping only unique designation names.
    const uniqueInputValues = [...new Set(
        values.map(v => String(v).trim()).filter(Boolean)
    )];

    if (uniqueInputValues.length === 0) {
      return res.status(400).json({ success: false, error: "No valid designation names provided after filtering." });
    }

    // 3. CHECK FOR DUPLICATES: Efficiently find which of the designations
    // already exist in the database.
    const existingDocs = await Designation.find({ value: { $in: uniqueInputValues } });
    const existingValues = new Set(existingDocs.map(doc => doc.value));

    // 4. PREPARE NEW DESIGNATIONS: Filter the input to get only the designations
    // that are genuinely new.
    const newValuesToInsert = uniqueInputValues.filter(val => !existingValues.has(val));
    const alreadyExistCount = uniqueInputValues.length - newValuesToInsert.length;

    // If there are no new designations to add, we're done. This is a success.
    if (newValuesToInsert.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new designations were added as all provided designations already exist.",
        totalProvided: uniqueInputValues.length,
        inserted: 0,
        alreadyExists: alreadyExistCount,
      });
    }

    // 5. INSERT: Prepare the new documents and insert them in one go.
    // The documents only need the 'value' field.
    const documentsToInsert = newValuesToInsert.map(value => ({ value }));
    const inserted = await Designation.insertMany(documentsToInsert);

    // 6. RESPOND: Send a clear, detailed success response.
    res.status(201).json({
      success: true,
      message: `Successfully added ${inserted.length} new designation(s).`,
      totalProvided: uniqueInputValues.length,
      inserted: inserted.length,
      alreadyExists: alreadyExistCount,
      insertedValues: inserted.map(doc => doc.value),
    });

  } catch (err) {
    // This will catch any unexpected server or database errors.
    console.error("Error in addDesignations:", err);
    res.status(500).json({
      success: false,
      error: "An internal server error occurred while adding designations.",
    });
  }
};

module.exports = {
  updateDesignation,getAllDesignations,deleteAllDesignations,insertAllDesignations,
};