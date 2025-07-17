const {Designation} = require("../../models/dropdownValuesModel");
const {Batchmate} = require("../../models/Batchmate");

const updateDesignation = async (req, res) => {
  try {
    // 1. Get the batchmate ID from the request parameters.
    const { id } = req.params;

    // 2. Get the new designation string from the request's body.
    const { designation } = req.body;

    // 3. Validate the input
    if (!designation) {
      return res.status(400).json({
        success: false,
        message: 'A designation string is required in the request body',
      });
    }

    // 4. Check if this Designation already exists in the `Designations` collection.
    try {
      let designationExists = await Designation.findOne({ name: designation });
      let wasDesignationCreated = false;

      // 5. If the Designation does NOT exist, create it.
      if (!designationExists) {
        console.log(`Designation "${designation}" not found. Creating it now...`);

        // Get the highest ID and increment by 1
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

      // 6. Now, update the batchmate with the new designation string.
      // Assuming the field in the Batchmate model is also called 'designation'.
      const updatedBatchmate = await Batchmate.findByIdAndUpdate(
        id,
        { job_profile: designation }, // The data to update
        { new: true, runValidators: true }
      );

      if (!updatedBatchmate) {
        return res.status(404).json({
          success: false,
          message: 'Batchmate not found',
        });
      }

      // 7. Return success response
      return res.status(200).json({
        success: true,
        message: `Batchmate Designation updated. ${wasDesignationCreated ? 'A new Designation was also created in the database.' : ''}`.trim(),
        data: updatedBatchmate,
      });

    } catch (error) {
      console.error('Error in updateDesignation handler:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  } catch (error) {
    console.error('Error in updateDesignation handler:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

//getAllDesignations
// This function retrieves all designations from the database
const getAllDesignations = async (req, res) => {
  try {
    // 1. Call your database logic to fetch the data from the 'designations' collection
    const designations = await Designation.find({});

    // 2. Check if any designations were found (optional but good practice)
    if (!designations || designations.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No designations found",
        count: 0,
        data: [],
      });
    }

    // 3. Return the designations in the response
    return res.status(200).json({
      success: true,
      message: "Designations retrieved successfully",
      count: designations.length,
      data: designations,
    });

  } catch (error) {
    console.error("Server Error in getAllDesignations:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Deleting all the Designations
// This function deletes all designations from the database
const deleteAllDesignations = async (req, res) => {
  try {
    // 1. Delete all documents from the Designations collection
    const deletionResult = await Designation.deleteMany({});

    // 2. Check if any documents were actually deleted
    if (deletionResult.deletedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No designations found to delete. The collection was already empty.",
        deletedCount: 0,
      });
    }

    // 3. Return success response with the count of deleted documents
    return res.status(200).json({
      success: true,
      message: `Successfully deleted all ${deletionResult.deletedCount} designations.`,
      deletedCount: deletionResult.deletedCount,
    });

  } catch (error) {
    console.error("Server Error in deleteAllDesignations:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while trying to delete designations.",
    });
  }
};

//inserting bulk designations
// This function inserts multiple designations at once
const insertAllDesignations = async (req, res) => {
  try {
    // 1. Get the array of designation names from the request body
    const { designations } = req.body;

    // 2. Validate the input
    if (!Array.isArray(designations) || designations.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of designation names.",
      });
    }

    // 3. Clean and validate the input data
    // filtering out empty values, and keeping only unique designation names.
    const uniqueInputValues = [...new Set(designations.filter(name => name && name.trim() !== ''))];

    if (uniqueInputValues.length === 0) {
      return res.status(400).json({ success: false, error: "No valid designation names provided after filtering." });
    }

    // 4. CHECK FOR DUPLICATES: Efficiently find which of the designations
    // already exist in the database
    const existingDocs = await Designation.find({ value: { $in: uniqueInputValues } });
    const existingValues = existingDocs.map(doc => doc.value);

    // 5. PREPARE NEW DESIGNATIONS: Filter the input to get only the designations
    // that don't already exist
    const newDesignations = uniqueInputValues.filter(value => !existingValues.includes(value));

    // If there are no new designations to add, we're done. This is a success.
    if (newDesignations.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new designations were added as all provided designations already exist.",
        addedCount: 0,
        existingCount: existingValues.length,
      });
    }

    // 6. INSERT NEW DESIGNATIONS: Prepare documents for insertion
    const documentsToInsert = newDesignations.map((name, index) => ({
      id: Date.now() + index, // Simple ID generation
      value: name,
      name: name,
    }));

    // 7. Insert the new designations
    const inserted = await Designation.insertMany(documentsToInsert);

    // 8. Return success response
    return res.status(201).json({
      success: true,
      message: `Successfully added ${inserted.length} new designation(s).`,
      addedCount: inserted.length,
      existingCount: existingValues.length,
      data: inserted,
    });

  } catch (err) {
    console.error("Error in addDesignations:", err);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred while adding designations.",
    });
  }
};

// ADD single designation value
const addSingleDesignation = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Designation value is required." });
    }
    const trimmed = value.trim();
    const exists = await Designation.findOne({ value: { $regex: new RegExp(`^${trimmed}$`, "i") } });
    if (exists) {
      return res.status(400).json({ success: false, message: `Designation \"${exists.value}\" already exists (case-insensitive match).` });
    }
    const newItem = new Designation({ value: trimmed });
    const saved = await newItem.save();
    res.status(201).json({ success: true, message: "Designation added successfully.", data: saved });
  } catch (err) {
    console.error("Error in addSingleDesignation:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Designation already exists." });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE designation by ID
const updateDesignationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Designation value is required." });
    }
    const trimmed = value.trim();
    const existing = await Designation.findOne({ _id: { $ne: id }, value: { $regex: new RegExp(`^${trimmed}$`, "i") } });
    if (existing) {
      return res.status(400).json({ success: false, message: `Designation \"${existing.value}\" already exists (case-insensitive match).` });
    }
    const updated = await Designation.findByIdAndUpdate(id, { value: trimmed }, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Designation not found." });
    }
    res.status(200).json({ success: true, message: "Designation updated successfully.", data: updated });
  } catch (err) {
    console.error("Error in updateDesignationById:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Designation already exists." });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE designation by ID
const deleteDesignationById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Designation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Designation not found." });
    }
    res.status(200).json({ success: true, message: "Designation deleted.", deleted });
  } catch (err) {
    console.error("Error in deleteDesignationById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  updateDesignation,getAllDesignations,deleteAllDesignations,insertAllDesignations,
  addSingleDesignation,
  updateDesignationById,
  deleteDesignationById
};