const Batchmate = require("../models/Batchmate");

// Disable multiple users (or one user)
const disableMultipleBatchmates = async (req, res) => {
  try {
    const ids = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide a non-empty array of batchmate IDs.",
      });
    }

    const result = await Batchmate.updateMany(
      { _id: { $in: ids } },
      { $set: { isUserActive: false } }
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} user(s) disabled.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error disabling batchmates:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Enable multiple users (or one user)
const enableMultipleBatchmates = async (req, res) => {
  try {
    const ids = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide a non-empty array of batchmate IDs.",
      });
    }

    const result = await Batchmate.updateMany(
      { _id: { $in: ids } },
      { $set: { isUserActive: true } }
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} user(s) enabled.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error enabling batchmates:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  disableMultipleBatchmates,
  enableMultipleBatchmates,
};
