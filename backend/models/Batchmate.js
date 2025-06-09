// models/Batchmate.js (or wherever your schema is)
const mongoose = require('mongoose');

const batchmateSchema = new mongoose.Schema({
  name: { type: String },
  email_address: { type: String,  unique: true },
  primary_skill: { type: String,   },             
  additional_skills: { type: String },          
  management_level: { type: String },           
  work_location: { type: String },              
  project: { type: String },
  overall_experience: { type: String },         
  current_role: { type: String },               
  job_profile: String,                                          
  industry_knowledge: String,                                   
  automation_skills: String,                                    
  devops_skills: String,
  cloud_knowledge: String,                                      
  agile_project: String,                                        
  plm_development: String,                                      
  plm_testing: String,                                          
  plm_support: String,                                          
  plm_admin: String,                                            
  plm_upgrade: String,                                          
  plm_cad_integration: String,                                  
  plm_interface_integration: String,
  plm_sap_integration: String,                                  
  tc_manufacturing: String,                                     
  plm_qms_integration: String, 
  software_engineering: String,
  project_management: String,                                   
  plm_functional: String,                                       
  plm_migration: String,                                        
  plm_product_configurators: String,                            
  active_workspace_customization: String,                       
  teamcenter_module_experience: String,                         
  external_certifications__completed_along_with_completion__expiry_date: String, 
  certifications_in_progress: String,                           
  special_call_out: String,                                     
}, { strict: false, timestamps: true}
);

module.exports = mongoose.model('Batchmate', batchmateSchema);