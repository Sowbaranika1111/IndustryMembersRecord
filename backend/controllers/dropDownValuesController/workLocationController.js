const { WorkLocation } = require("../../models/dropdownValuesModel.js");
const Batchmate = require('../../models/Batchmate.js');



// updating the worklocation in the ui and db if it already not exists

const updateWorkLocation = async (req, res) => {
  try {
    // 1. Get the ID of the batchmate from the URL parameters
    const batchmateId = req.params.id;

    // 2. Get the new Location value from the request's body.
    const { work_location } = req.body;

    if (!work_location) {
      return res.status(400).json({ message: 'work_location is required in the body' });
    }

    // --- SMART LOGIC STARTS HERE ---
    // 3. Check if this Location already exists in the `WorkLocations` collection.
    let locationExists = await WorkLocation.findOne({ value: work_location });
    let wasLocationCreated = false;

    // 4. If the Location does NOT exist, create it.
    if (!locationExists) {
      console.log(`Location "${work_location}" not found. Creating it now...`);

      // Find the highest existing numeric 'id' to generate a new unique one.
      const lastLocation = await WorkLocation.findOne().sort({ id: -1 });
      const newId = lastLocation ? lastLocation.id + 1 : 1;

      // Create the new Location document in the 'WorkLocations' collection
      await WorkLocation.create({
        id: newId,
        value: work_location,
        
      });
      wasLocationCreated = true;
      console.log(`Successfully created new Location: "${work_location}"`);
    }
    // --- SMART LOGIC ENDS HERE ---

    // 5. Now, update the batchmate with the Location string.
    const updatedBatchmate = await Batchmate.findByIdAndUpdate(
      batchmateId,
      { work_location: work_location }, // The data to update
      { new: true } // Return the updated document
    );

    if (!updatedBatchmate) {
      return res.status(404).json({ message: 'Batchmate not found' });
    }

    // 6. Send a successful response.
    res.status(200).json({
      success: true,
      message: `Batchmate Location updated. ${wasLocationCreated ? 'A new Location was also created in the database.' : ''}`.trim(),
      data: updatedBatchmate
    });

  } catch (error) {
    console.error('Error updating Location:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

  const getAllWorkLocations = async (req, res) => {
  try {
    // 1. Call your database logic to fetch the data
    const locations = await WorkLocation.find({});

    // 2. Check if any locations were found (optional but good practice)
    if (!locations || locations.length === 0) {
      // Respond with 404 Not Found if the collection is empty
      return res.status(404).json({
        success: false,
        message: "No work locations found",
      });
    }

    // 3. Send a SUCCESS response
    // Status 200 means OK.
    // We send a JSON object containing the data.
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });

  } catch (error) {
    // 4. If any error occurs in the 'try' block, this 'catch' block will run
    console.error("Server Error in getAllWorkLocationsHandler:", error);

    // 5. Send an ERROR response
    // Status 500 means Internal Server Error.
    // We send a generic error message to the client for security.
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//for deleting all the worklocations 

const deleteAllWorkLocations = async (req, res) => {
  try {
    // 1. Call your database logic to delete all documents in the collection
    // The result object contains information like `deletedCount`.
    const result = await WorkLocation.deleteMany({});

    // 2. Check how many documents were deleted
    if (result.deletedCount === 0) {
      // This isn't an error, but it means the collection was already empty.
      return res.status(200).json({
        success: true,
        message: "No work locations to delete. The collection was already empty.",
        deletedCount: 0,
      });
    }

    // 3. Send a SUCCESS response confirming the deletion
    res.status(200).json({
      success: true,
      message: `Successfully deleted all ${result.deletedCount} work locations.`,
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    // 4. If any error occurs, this 'catch' block will run
    console.error("Server Error in deleteAllWorkLocations:", error);

    // 5. Send an ERROR response
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//insert all worklocations(BULK)

const insertAllWorkLocations = async (req, res) => {
  try {
    // 1. VALIDATE INPUT: Expects a simple array of strings.
    const values = req.body;
    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of work location names.",
      });
    }

    // 2. NORMALIZE DATA: Clean up the input by trimming whitespace,
    // filtering out empty values, and keeping only unique location names.
    const uniqueInputValues = [...new Set(
        values.map(v => String(v).trim()).filter(Boolean)
    )];

    if (uniqueInputValues.length === 0) {
      return res.status(400).json({ success: false, error: "No valid work location names provided after filtering." });
    }

    // 3. CHECK FOR DUPLICATES: Efficiently find which of the locations
    // already exist in the database.
    const existingDocs = await WorkLocation.find({ value: { $in: uniqueInputValues } });
    const existingValues = new Set(existingDocs.map(doc => doc.value));

    // 4. PREPARE NEW LOCATIONS: Filter the input to get only the locations
    // that are genuinely new.
    const newValuesToInsert = uniqueInputValues.filter(val => !existingValues.has(val));
    const alreadyExistCount = uniqueInputValues.length - newValuesToInsert.length;

    // If there are no new locations to add, we're done. This is a success.
    if (newValuesToInsert.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new work locations were added as all provided locations already exist.",
        totalProvided: uniqueInputValues.length,
        inserted: 0,
        alreadyExists: alreadyExistCount,
      });
    }

    // 5. INSERT: Prepare the new documents and insert them in one go.
    // The documents only need the 'value' field, as MongoDB handles the rest.
    const documentsToInsert = newValuesToInsert.map(value => ({ value }));
    const inserted = await WorkLocation.insertMany(documentsToInsert);

    // 6. RESPOND: Send a clear, detailed success response.
    res.status(201).json({
      success: true,
      message: `Successfully added ${inserted.length} new work location(s).`,
      totalProvided: uniqueInputValues.length,
      inserted: inserted.length,
      alreadyExists: alreadyExistCount,
      insertedValues: inserted.map(doc => doc.value),
    });

  } catch (err) {
    // This will catch any unexpected server or database errors.
    console.error("Error in addWorkLocations:", err);
    res.status(500).json({
      success: false,
      error: "An internal server error occurred while adding work locations.",
    });
  }
};



module.exports = {
  updateWorkLocation,getAllWorkLocations,deleteAllWorkLocations,insertAllWorkLocations,
};