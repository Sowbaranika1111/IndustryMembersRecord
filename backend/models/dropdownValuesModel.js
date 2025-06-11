  const mongoose = require("mongoose");

  // Current Role Schema
  const currentRoleSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    value: { type: String, required: true },
  });

  //work location schema

<<<<<<< Updated upstream
// Cloud Knowledge Schema
const cloudKnowledgeSchema = new mongoose.Schema({
     id: { type: Number, required: true, unique: true },
     category: { type: String, required: true },
     value: { type: String, required: true },
   });



// Export both models
module.exports = {
  CurrentRole: mongoose.model("currentRoleValues", currentRoleSchema),
  IndustryKnowledge: mongoose.model("IndustryKnowledge", industryKnowledgeSchema),
  CloudKnowledge: mongoose.model("CloudKnowledge", cloudKnowledgeSchema),
//  Role: mongoose.model('Role', roleSchema)
};
=======
  const workLocationSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    value: { type: String, required: true },
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
    // ,
    // IndustryKnowledge: mongoose.model("IndustryKnowledge", industryKnowledgeSchema),
  };
>>>>>>> Stashed changes
