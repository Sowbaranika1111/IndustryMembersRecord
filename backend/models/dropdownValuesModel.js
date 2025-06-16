  const mongoose = require("mongoose");

  // Current Role Schema
  const currentRoleSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    value: { type: String, required: true },
  });

  //work location schema

  const workLocationSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    value: { type: String, required: true },
  });

  const designationSchema = new mongoose.Schema({
  
  id: {
    type: Number, required: [true, 'A designation ID is required.'],unique: true},
  value: {type: String,required: true }
});





  //cloud-knowledge Schema
const cloudKnowledgeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  category: { type: String, required: true, default: 'cloud_knowledge' },
  value: { type: String, required: true, unique: true, lowercase: true, trim: true },
});

//Project Schema

const projectSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  value: { type: String, required: true, unique: true ,lowercase: true},

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
    // IndustryKnowledge: mongoose.model("IndustryKnowledge", industryKnowledgeSchema),
  };