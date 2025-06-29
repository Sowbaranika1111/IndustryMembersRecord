const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const batchmateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isUserActive: { type: Boolean, default: true },
    otp: { type: String }, // Store hashed OTP
    otp_expiry: { type: Date }, // Expiry timestamp
    email_address: { type: String, required: true, unique: true, lowercase: true, trim: true },
    enterpriseid: { type: String },
    primary_skill: { type: String },
    additional_skills: { type: String },
    management_level: { type: String },
    work_location: { type: String },
    project: { type: String },
    job_profile: String,
    current_role: { type: String },
    overall_experience_years: { type: String },
    overall_experience_months: { type: String },
    overall_experience: { type: String },
    industry_knowledge: String,
    automation_skills: String,
    devops_skills: String,
    cloud_knowledge: String,
    sw_engineering: String,
    agile_project: String,
    plm_development: String,
    plm_development_expertise: String,
    plm_development_experience: String,
    plm_testing: String,
    plm_testing_expertise: String,
    plm_testing_experience: String,
    plm_support: String,
    plm_support_expertise: String,
    plm_support_experience: String,
    plm_admin: String,
    plm_admin_expertise: String,
    plm_admin_experience: String,
    plm_upgrade: String,
    plm_upgrade_expertise: String,
    plm_upgrade_experience: String,
    plm_cad_integration: String,
    plm_cad_integration_expertise: String,
    plm_cad_integration_experience: String,
    plm_interfaceintegration: String,
    plm_integration_expertise: String,
    plm_integration_experience: String,
    plm_sap_integration: String,
    tc_manufacturing: String,
    plmqms_integration: String,
    project_management: String,
    plm_functional: String,
    plm_migration: String,
    plm_product_configurators: String,
    active_workspace_customization: String,
    teamcenter_module_experience: String,
    project_delivery_model: String,
    project_delivery_years: String,
    project_delivery_experience: String,
    external_certifications__completed_along_with_completion__expiry_date: String,
    certifications_in_progress: String,
    special_call_out: String,
  },
  { strict: false, timestamps: true }
);

batchmateSchema.pre("save", async function (next) {
  if (this.isModified("otp") && this.otp) {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
  }
  next();
});

batchmateSchema.methods.compareOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};
module.exports = mongoose.model("Batchmate", batchmateSchema);
