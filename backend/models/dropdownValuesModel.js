const mongoose = require("mongoose");

const currentRoleSchema = new mongoose.Schema({

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
    unique: true,   
    trim: true,
  },
}, {
  timestamps: true,
});

//designation schema
  const designationSchema = new mongoose.Schema({
 value: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, {
  timestamps: true,
});

// PLM Development Schema
const plmDevelopmentExpertiseSchema = new mongoose.Schema({

  value: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, {
  timestamps: true,
});

//PLM Admin Expertise Schema

const plmAdminExpertiseSchema = new mongoose.Schema({

  value: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
  },
}, {
  timestamps: true, 
});


// PLM Upgrade Expertise Schema
const plmUpgradeExpertiseSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true }); 

// PLM Testing Expertise Schema
const plmTestingExpertiseSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true, trim: true },

}, { timestamps: true });

// PLM Integration Expertise Schema
const plmIntegrationExpertiseSchema = new mongoose.Schema({
value: { type: String, required: true, unique: true, trim: true },
},{
timestamps: true, // Automatically adds createdAt and updatedAt.
});


// PLM Support Expertise Schema
const plmSupportExpertiseSchema = new mongoose.Schema({
value: { type: String, required: true, unique: true, trim: true },
},{
timestamps: true, // Automatically adds createdAt and updatedAt.
});


//cloud-knowledge Schema
const cloudKnowledgeSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

//Project Schema
const projectSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true, trim: true }
});

// DevOps Skills Schema
const devopsSkillsSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true, trim: true }
});

const plmSapExpertiseSchema= new mongoose.Schema({
  value: { type: String, required: true, unique: true, trim: true }
});

// Industry Knowledge Schema
// const industryKnowledgeSchema = new mongoose.Schema({
//   id: { type: Number, required: true, unique: true },
//   category: { type: String, required: true, default: "industry_knowledge" },
//   value: { type: String, required: true },
// });


//plmCadIntegrationSchema
const plmCadIntegrationSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, {
  timestamps: true,
});


// projectDeliveryModelsSchema
const projectDeliveryModelsSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, {
  timestamps: true,
});



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
    PLMCADintegrations: mongoose.model("PLMCADintegrations",plmCadIntegrationSchema),
    ProjectDeliveryModels: mongoose.model("ProjectDeliveryModels",projectDeliveryModelsSchema),
    PLMIntegrationExpertise: mongoose.model("PLMIntegrationExpertise",plmIntegrationExpertiseSchema),
    PLMSupportExpertise: mongoose.model("PLMSupportExpertise",plmSupportExpertiseSchema),
    PLMTestingExpertise: mongoose.model("PLMTestingExpertise", plmTestingExpertiseSchema),
    PLMCADintegrations: mongoose.model("PLMCADintegrations",plmCadIntegrationSchema),
    PLMSapExpertise: mongoose.model("PLMSapExpertise",plmSapExpertiseSchema),
    // IndustryKnowledge: mongoose.model("IndustryKnowledge", industryKnowledgeSchema),
  };