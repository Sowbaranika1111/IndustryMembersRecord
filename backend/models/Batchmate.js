const mongoose = require("mongoose");

const batchmateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    primarySkill: { type: String, required: true },
    additionalSkills: { type: String, required: true },

    // Dropdown values can be validated here
    managementLevel: {
      type: String,
      required: true,
      enum: [
        "6","7","8","9","10","11","12"
      ],
    },

    workLocation: { type: String, required: true },
    project: { type: String, required: true },
    overallExperience: { type: String, required: true },

    currentRole: { type: String, required: true },
    currentRoleNote: { type: String }, // if value not in dropdown, add as note

    jobProfile: { type: String },
    industryKnowledge: { type: String },

    automationSkills: { type: String, maxlength: 100 }, // 4 words limit approx.
    devOpsSkills: { type: String, maxlength: 100 }, // 4 words limit approx.

    cloudKnowledge: { type: String },
    agileProject: { type: String },

    plmDevelopment: { type: String },
    plmDevelopmentNote: { type: String }, // Note with Exp: Tester, Sr.Tester, Test Lead

    plmTesting: { type: String },
    plmTestingNote: { type: String },

    plmSupport: { type: String },
    plmSupportNote: { type: String }, // L1.5, L2, L3, Shift Lead

    plmAdmin: { type: String },
    plmAdminNote: { type: String }, // Admin, Sr.Admin, Infra Architect, Release Manager

    plmUpgrade: { type: String },
    plmUpgradeNote: { type: String }, // PM, Tester, Admin, Developer

    plmCadIntegration: { type: String },
    plmCadIntegrationNote: { type: String }, // NX, Creo, SolidWorks, Catia

    plmInterfaceIntegration: { type: String },
    plmInterfaceIntegrationNote: { type: String }, // SOA, T4EA, Python, Perl

    plmSapIntegration: { type: String },
    plmSapIntegrationNote: { type: String }, // T4S, T4ST, OpenPDM

    tcManufacturing: { type: String },
    tcManufacturingNote: { type: String }, // MPP, EasyPlan, Technomatix, Plant Simulation

    plmQmsIntegration: { type: String },
    plmQmsIntegrationNote: { type: String }, // Along with role played

    softwareEngineering: { type: String },

    projectManagement: { type: String },
    projectManagementNote: { type: String }, // Complexity of team handled

    plmFunctional: { type: String },
    plmFunctionalNote: { type: String }, // Details on functional area experience

    plmMigration: { type: String },

    plmProductConfigurators: { type: String },
    plmProductConfiguratorsNote: { type: String },

    activeWorkspaceCustomization: { type: String },
    activeWorkspaceCustomizationNote: { type: String }, // Developer, Sr.Developer, SME

    teamcenterModuleExperience: { type: String },

    externalCertifications: {
      completed: { type: String },
      completionDate: { type: String },
      expiryDate: { type: String },
    },

    certificationsInProgress: { type: String },
    specialCallOut: { type: String },
  },
  { strict: false, timestamps: true }
);

module.exports = mongoose.model("Batchmate", batchmateSchema);
