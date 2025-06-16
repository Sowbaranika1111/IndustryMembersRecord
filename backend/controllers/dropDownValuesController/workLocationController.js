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

module.exports = {
  updateWorkLocation,getAllWorkLocations,deleteAllWorkLocations,
};