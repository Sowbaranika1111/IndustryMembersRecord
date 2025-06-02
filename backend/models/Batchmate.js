const mongoose = require('mongoose');
 
const batchmateSchema = new mongoose.Schema({
  name: String,
  primarySkill: String,
  additionalSkills: String,
  managementLevel: String,
  overallExperience: String,
  currentRole: String,
  industryKnowledge: String,
  automationSkills: String,
  devOpsSkills: String,
  cloudKnowledge: String,
  agileProject: String,
  plmDevelopment: String,
  plmTesting: String,
  plmSupport: String,
  plmAdmin: String,
  plmUpgrade: String,
  plmCadIntegration: String,
  plmInterfaceIntegration: String,
  plmSapIntegration: String,
  tcManufacturing: String,
  plmQmsIntegration: String,
  softwareEngineering: String,
  projectManagement: String,
  plmFunctional: String,
  plmMigration: String,
  plmProductConfigurators: String,
  activeWorkspaceCustomization: String,
  teamcenterModuleExperience: String,
  externalCertifications: {
    completed: String,
    completionDate: String,
    expiryDate: String
  },
  certificationsInProgress: String,
  specialCallOut: String,
}, { strict: false,timestamps: true });
 
module.exports = mongoose.model('Batchmate', batchmateSchema);
 
 