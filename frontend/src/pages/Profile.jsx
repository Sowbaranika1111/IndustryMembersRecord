import React from 'react';

const data = {
    name: "A. M. Karthikeyan",
    email_address: "a.m.karthikeyan@accenture.com",
    primary_skill: "Microsoft ASP.NET",
    additional_skills: "Microsoft SQL Server, Microsoft Windows Communication Foundation (WCF), Microsoft Azure PaaS, Coaching, Developer Ecosystem, Inclusive Leadership",
    management_level: "9",
    work_location: "India - Chennai - CDC2E - SEZ",
    project: "ABB EL ConfigIT AMS_FAC",
    job_profile: "Custom Software Engineering Specialist",
    overall_experience: "",
    current_role: "",
    industry_knowledge: "",
    automation_skills: "",
    devops_skills: "",
    cloud_knowledge: "",
    agile_project: "Awareness",
    plm_development: "1 - 2 years",
    plm_testing: "",
    plm_support: "",
    plm_admin: "",
    plm_upgrade: "",
    plm_cad_integration: "",
    plm_interfaceintegration: "",
    plm_sap_integration: "",
    tc_manufacturing: "",
    plmqms_integration: "",
    sw_engineering: "",
    project_management: "",
    plm_functional: "",
    plm_migration: "",
    plm_product_configurators: "",
    active_workspace_customization: "",
    teamcenter_module_experience: "",
    external_certifications__completed_along_with_completion__expiry_date: "",
    certifications_in_progress: "",
    special_call_out: ""
};

export default function Profile() {
    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Centered Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#ccc',
                    backgroundImage: 'url(https://api.dicebear.com/7.x/personas/svg?seed=Karthikeyan)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginBottom: '10px'
                }}></div>
                <h2 style={{
                    margin: '0',
                    fontWeight: '700',
                    fontSize: '28px',
                    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                    color: '#2e2e2e'
                }}>
                    {data.name}
                </h2>

                <p style={{
                    margin: '6px 0',
                    fontSize: '16px',
                    fontFamily: '"Roboto", sans-serif',
                    color: '#555'
                }}>
                    {data.job_profile} | {data.work_location} | Level {data.management_level}
                </p>

                <p style={{
                    margin: '0',
                    fontSize: '15px',
                    fontStyle: 'italic',
                    fontFamily: '"Georgia", serif',
                    color: '#6a6a6a'
                }}>
                    Project: {data.project}
                </p>

            </div>

            {/* Two-column Details Section */}
            <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
                {/* Left Box */}
                <div style={{
                    flex: 1,
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.8',
                    fontSize: '16px'
                }}>
                    <p><strong>Email:</strong> {data.email_address}</p>
                    <p><strong>Primary Skill:</strong> {data.primary_skill}</p>
                    <p><strong>Additional Skills:</strong> {data.additional_skills}</p>
                    <p><strong>Overall Experience:</strong> {data.overall_experience || 'N/A'}</p>
                    <p><strong>Current Role:</strong> {data.current_role || 'N/A'}</p>
                    <p><strong>Industry Knowledge:</strong> {data.industry_knowledge || 'N/A'}</p>
                    <p><strong>Automation Skills:</strong> {data.automation_skills || 'N/A'}</p>
                </div>

                {/* Right Box */}
                <div style={{
                    flex: 1,
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.8',
                    fontSize: '16px'
                }}>
                    <p><strong>DevOps Skills:</strong> {data.devops_skills || 'N/A'}</p>
                    <p><strong>Cloud Knowledge:</strong> {data.cloud_knowledge || 'N/A'}</p>
                    <p><strong>Agile Project:</strong> {data.agile_project}</p>
                    <p><strong>PLM Development:</strong> {data.plm_development}</p>
                    <p><strong>Certifications:</strong> {data.external_certifications__completed_along_with_completion__expiry_date || 'N/A'}</p>
                    <p><strong>Certifications In Progress:</strong> {data.certifications_in_progress || 'N/A'}</p>
                    <p><strong>Special Call Out:</strong> {data.special_call_out || 'N/A'}</p>
                </div>
            </div>

        </div>
    );
}
