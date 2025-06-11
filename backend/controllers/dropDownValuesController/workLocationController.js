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



module.exports = {
  updateWorkLocation,
};