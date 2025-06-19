const mongoose = require("mongoose");

// Current Role Schema
// const currentRoleSchema = new mongoose.Schema({
//   id: { type: Number, required: true, unique: true },
//   value: { type: String, required: true },
// });

const currentRoleSchema = new mongoose.Schema({
  // The manual 'id' field is GONE. This is the fix.
  // We rely on MongoDB's automatic _id.

  value: {
    type: String,
    required: true,
    unique: true,   // A database-level rule to prevent duplicate role names.
    trim: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt.
});






//work location schema

const workLocationSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,   // A database-level rule to prevent duplicate role names.
    trim: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt.
});

//designation schema
  const designationSchema = new mongoose.Schema({
 value: {
    type: String,
    required: true,
    unique: true,   // A database-level rule to prevent duplicate role names.
    trim: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt.
});

// PLM Development Schema
const plmDevelopmentExpertiseSchema = new mongoose.Schema({
  // The manual 'id' field is GONE. This is the fix.
  // We rely on MongoDB's automatic _id.

  value: {
    type: String,
    required: true,
    unique: true,   // A database-level rule to prevent duplicate role names.
    trim: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt.
});

//PLM Admin Expertise Schema

const plmAdminExpertiseSchema = new mongoose.Schema({
  // The manual 'id' field is GONE. This is the fix.
  // We rely on MongoDB's automatic _id.

  value: {
    type: String,
    required: true,
    unique: true,   // A database-level rule to prevent duplicate role names.
    trim: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt.
});


// PLM Upgrade Expertise Schema
const plmUpgradeExpertiseSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true, trim: true }
});

// PLM Testing Expertise Schema
const plmTestingExpertiseSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true, trim: true }
});







//cloud-knowledge Schema
const cloudKnowledgeSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true, trim: true }
});

//Project Schema
const projectSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true, trim: true }
});

// DevOps Skills Schema
const devopsSkillsSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true, trim: true }
});
// Industry Knowledge Schema
// const industryKnowledgeSchema = new mongoose.Schema({
//   id: { type: Number, required: true, unique: true },
//   category: { type: String, required: true, default: "industry_knowledge" },
//   value: { type: String, required: true },
// });

  // Export both models
  module.exports = {
    CurrentRole: mongoose.model("CurrentRole", currentRoleSchema),
    WorkLocation: mongoose.model("WorkLocation", workLocationSchema),
    CloudKnowledge:mongoose.model('CloudKnowledge', cloudKnowledgeSchema),
    Project: mongoose.model('Project', projectSchema),
    Designation:mongoose.model('Designation',designationSchema),
    DevopsSkill:mongoose.model("DevopsSkill", devopsSkillsSchema),
    PLMDevelopmentExpertise:mongoose.model("PLMDevelopmentExpertise",plmDevelopmentExpertiseSchema),
    PLMAdminExpertise:mongoose.model("PLMAdminExpertise", plmAdminExpertiseSchema),
    PLMUpgradeExpertise: mongoose.model("PLMUpgradeExpertise", plmUpgradeExpertiseSchema),
  PLMTestingExpertise: mongoose.model("PLMTestingExpertise", plmTestingExpertiseSchema),
    // IndustryKnowledge: mongoose.model("IndustryKnowledge", industryKnowledgeSchema),
  };