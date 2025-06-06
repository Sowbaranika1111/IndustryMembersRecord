const { CurrentRole } = require("../../models/dropdownValuesModel.js");

// GET /api/dropdown/current_role
// http://localhost:5000/api/dropdown/current_role GET

exports.getCurrentValuesByCategory = async (req, res) => {
  try {
    const values = await CurrentRole.find({ category: "current_role" }).sort({
      id: 1,
    });
    res.json(values);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new current role
// http://localhost:5000/api/dropdown/current_role POST {"value" : "Dev"}

exports.addNewCurrentRole = async (req, res) => {
  try {
    const { value } = req.body;

    // Validate
    if (!value) {
      return res.status(400).json({ error: "Role value is required." });
    }

    // Check if roles already exist to avoid duplication
    const count = await CurrentRole.countDocuments({
      category: "current_role",
    });
    if (count > 0) {
      return res.status(400).json({ message: "Role already exists." });
    }

    // Find the max existing ID
    const lastEntry = await CurrentRole.findOne({
      category: "current_role",
    }).sort({ id: -1 });

    const nextId = lastEntry ? lastEntry.id + 1 : 1;

    const newRole = new CurrentRole({
      id: nextId,
      category: "current_role",
      value,
    });

    const saved = await newRole.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a current role by ID
// http://localhost:5000/api/dropdown/current_role/3 Delete
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




// //! BULK INSERT all current roles
// exports.insertAllCurrentRoles = async (req, res) => {
//   try {
//     const roles = [
//       "Teamcenter Jr Developer",
//       "Teamcenter Sr Developer",
//       "Teamcenter SME",
//       "Polarion Developer",
//       ".NET Developer",
//       "Java Developer",
//       "Oracle Agile PLM Developer",
//       "Oracle Agile PLM SME",
//       "AWS Developer",
//       "AWS SME",
//       "Azure Developer",
//       "Azure SME",
//       "GCP Developer",
//       "GCP SME",
//       "DevOps Developer",
//       "DevOps SME",
//       "Automation Developer",
//       "Others",
//       "Tester",
//       "Test lead",
//       "Teamcenter Admin",
//       "Teamcenter Support",
//       "Shift Lead",
//       "Service Lead",
//       "CAD Developer",
//       "CAD Designer",
//       "CAD SME",
//       "L1.5-Junior",
//       "L2-Working experience",
//       "L3 - Strong experience",
//       "Rulestream Developer",
//       "Rulestream SME",
//       "Delivery Lead",
//       "Project Manager",
//     ];

//     // Prepare with incremental IDs
//     const documents = roles.map((role, index) => ({
//       id: index + 1,
//       category: "current_role",
//       value: role,
//     }));

//     const inserted = await CurrentRole.insertMany(documents);
//     res
//       .status(201)
//       .json({ message: "All roles inserted successfully.", inserted });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };