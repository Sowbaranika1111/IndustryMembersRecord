// backend/utils/excelHandler.js
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelFilePath = path.join(__dirname, '../excel/batchmates.xlsx');

// Define the column headers
const HEADERS = [
  "name", "primarySkill", "additionalSkills", "managementLevel", "overallExperience",
  "currentRole", "industryKnowledge", "automationSkills", "devOpsSkills", "cloudKnowledge",
  "agileProject", "plmDevelopment", "plmTesting", "plmSupport", "plmAdmin", "plmUpgrade",
  "plmCadIntegration", "plmInterfaceIntegration", "plmSapIntegration", "tcManufacturing",
  "plmQmsIntegration", "softwareEngineering", "projectManagement", "plmFunctional",
  "plmMigration", "plmProductConfigurators", "activeWorkspaceCustomization",
  "teamcenterModuleExperience", "externalCertifications", "certificationsInProgress",
  "specialCallOut"
];

// Format batchmate object into a flat Excel row
function formatRow(batchmate) {
  return {
    name: batchmate.name,
    primarySkill: batchmate.primarySkill,
    additionalSkills: batchmate.additionalSkills,
    managementLevel: batchmate.managementLevel,
    overallExperience: batchmate.overallExperience,
    currentRole: batchmate.currentRole,
    industryKnowledge: batchmate.industryKnowledge,
    automationSkills: batchmate.automationSkills,
    devOpsSkills: batchmate.devOpsSkills,
    cloudKnowledge: batchmate.cloudKnowledge,
    agileProject: batchmate.agileProject,
    plmDevelopment: batchmate.plmDevelopment,
    plmTesting: batchmate.plmTesting,
    plmSupport: batchmate.plmSupport,
    plmAdmin: batchmate.plmAdmin,
    plmUpgrade: batchmate.plmUpgrade,
    plmCadIntegration: batchmate.plmCadIntegration,
    plmInterfaceIntegration: batchmate.plmInterfaceIntegration,
    plmSapIntegration: batchmate.plmSapIntegration,
    tcManufacturing: batchmate.tcManufacturing,
    plmQmsIntegration: batchmate.plmQmsIntegration,
    softwareEngineering: batchmate.softwareEngineering,
    projectManagement: batchmate.projectManagement,
    plmFunctional: batchmate.plmFunctional,
    plmMigration: batchmate.plmMigration,
    plmProductConfigurators: batchmate.plmProductConfigurators,
    activeWorkspaceCustomization: batchmate.activeWorkspaceCustomization,
    teamcenterModuleExperience: batchmate.teamcenterModuleExperience,
    externalCertifications: batchmate.externalCertifications?.completed || '',
    certificationsInProgress: batchmate.certificationsInProgress,
    specialCallOut: batchmate.specialCallOut,
  };
}

function appendToExcel(batchmate) {
  let workbook, worksheet;

  if (fs.existsSync(excelFilePath)) {
    workbook = XLSX.readFile(excelFilePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Batchmates");
  }

  // Convert existing sheet to JSON
  const data = XLSX.utils.sheet_to_json(worksheet);
  data.push(formatRow(batchmate)); // Append new row

  // Convert back to sheet and save
  const newSheet = XLSX.utils.json_to_sheet(data, { header: HEADERS });
  workbook.Sheets[workbook.SheetNames[0]] = newSheet;
  XLSX.writeFile(workbook, excelFilePath);
}

module.exports = { appendToExcel };
