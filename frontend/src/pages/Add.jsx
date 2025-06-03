import React, { useState } from 'react';

const accenturePurple = '#6a0dad';

const fieldLabels = {
    name: 'Name',
    email_address: 'Email Address',
    management_level: 'Management Level',
    work_location: 'Work Location',
    project: 'Project',
    job_profile: 'Job Profile',
    current_role: 'Current Role',
    overall_experience: 'Overall Experience',
    primary_skill: 'Primary Skill',
    additional_skills: 'Additional Skills',
    agile_project: 'Agile Project',
    plm_development: 'PLM Development',
    industry_knowledge: 'Industry Knowledge',
    automation_skills: 'Automation Skills',
    devops_skills: 'DevOps Skills',
    cloud_knowledge: 'Cloud Knowledge',
    sw_engineering: 'Software Engineering',
    project_management: 'Project Management',
    plm_testing: 'PLM Testing',
    plm_support: 'PLM Support',
    plm_admin: 'PLM Admin',
    plm_upgrade: 'PLM Upgrade',
    plm_cad_integration: 'PLM CAD Integration',
    plm_interfaceintegration: 'PLM Interface/Integration',
    plm_sap_integration: 'PLM SAP Integration',
    tc_manufacturing: 'TC Manufacturing',
    plmqms_integration: 'PLM-QMS Integration',
    plm_functional: 'PLM Functional',
    plm_migration: 'PLM Migration',
    plm_product_configurators: 'PLM Product Configurators',
    active_workspace_customization: 'Active Workspace Customization',
    teamcenter_module_experience: 'Teamcenter Module Experience',
    external_certifications__completed_along_with_completion__expiry_date: 'Certifications (Completed)',
    certifications_in_progress: 'Certifications In Progress',
    special_call_out: 'Special Call Out'
};

const dropdownOptions = {
    current_role: [
        'Teamcenter Jr Developer', 'Teamcenter Sr Developer', 'Teamcenter SME', 'Polarion Developer', '.NET Developer', 'Java Developer',
        'Oracle Agile PLM Developer', 'Oracle Agile PLM SME', 'AWS Developer', 'AWS SME', 'Azure Developer', 'Azure SME',
        'GCP Developer', 'GCP SME', 'DevOps Developer', 'DevOps SME', 'Automation Developer', 'Others', 'Tester',
        'Test lead', 'Teamcenter Admin', 'Teamcenter Support', 'Shift Lead', 'Service Lead', 'CAD Developer',
        'CAD Designer', 'CAD SME', 'L1.5-Junior', 'L2-Working experience', 'L3 - Strong experience', 'Rulestream Developer',
        'Rulestream SME', 'Delivery Lead', 'Project Manager'
    ],
    industry_knowledge: [
        'Automotive', 'Industrial', 'Aerospace', 'Medical Devices', 'Hitech', 'Resources', 'Consumer Goods', 'None', 'Several'
    ],
    cloud_knowledge: [
        'Azure', 'AWS', 'GCP', 'multiple', 'All', 'None'
    ],
    agile_project: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_development: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_testing: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_support: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_admin: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_upgrade: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_cad_integration: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_interfaceintegration: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_sap_integration: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    tc_manufacturing: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plmqms_integration: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    sw_engineering: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_functional: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_migration: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    plm_product_configurators: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
    active_workspace_customization: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'],
};

const AddPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(
        Object.keys(fieldLabels).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step === 1 && (!formData.name || !formData.email_address)) {
            alert('Name and Email Address are required.');
            return;
        }
        setStep((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep((prev) => prev - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
    };

    const renderField = (name) => (
        <div key={name} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{fieldLabels[name]}</label>
            {dropdownOptions[name] ? (
                <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    style={{ width: '99%', padding: '10px', borderRadius: '5px' }}
                >
                    <option value="">Select...</option>
                    {dropdownOptions[name].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : (
                <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    style={{ width: '95%', padding: '10px', borderRadius: '5px' }}
                />
            )}
        </div>
    );

    const stepFields = {
        1: ['name', 'email_address', 'management_level', 'work_location', 'project', 'job_profile', 'current_role'],
        2: ['primary_skill', 'additional_skills', 'agile_project', 'plm_development', 'overall_experience', 'industry_knowledge', 'automation_skills', 'cloud_knowledge', 'devops_skills', 'sw_engineering', 'project_management', 'plm_testing', 'plm_support', 'plm_admin', 'plm_upgrade', 'plm_cad_integration', 'plm_interfaceintegration', 'plm_sap_integration', 'tc_manufacturing', 'plmqms_integration', 'plm_functional', 'plm_migration', 'plm_product_configurators', 'active_workspace_customization', 'teamcenter_module_experience'],
        3: ['external_certifications__completed_along_with_completion__expiry_date', 'certifications_in_progress', 'special_call_out']
    };

    return (
        <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px', color: '#000' }}>
            {/* Stepper with lines and animation */}
            <div style={{ position: 'relative', marginBottom: '40px' }}>
                {/* Gray Background Line */}
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '7.5%',
                    width: '85%',
                    height: '2px',
                    background: '#ccc',
                    zIndex: 1
                }} />
                {/* Animated Progress Line */}
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '7.5%',
                    width: `${(step - 1) * 42.5}%`,
                    height: '2px',
                    background: accenturePurple,
                    transition: 'width 0.4s ease-in-out',
                    zIndex: 2
                }} />
                {/* Circles */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 3
                }}>
                    {['Basic', 'Skills', 'Additional'].map((label, index) => (
                        <div key={label} style={{ textAlign: 'center', flex: 1 }}>
                            <div
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundColor: step >= index + 1 ? accenturePurple : '#fff',
                                    border: `2px solid ${accenturePurple}`,
                                    color: step >= index + 1 ? '#fff' : accenturePurple,
                                    lineHeight: '30px',
                                    margin: 'auto',
                                    fontWeight: 'bold',
                                    transition: 'all 0.4s ease-in-out'
                                }}
                            >
                                {index + 1}
                            </div>
                            <div style={{
                                marginTop: '5px',
                                fontWeight: step === index + 1 ? 'bold' : 'normal'
                            }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                border: `1px solid ${accenturePurple}`
            }}>
                {stepFields[step].map(renderField)}

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handlePrev}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#fff',
                                color: accenturePurple,
                                border: `2px solid ${accenturePurple}`,
                                borderRadius: '5px'
                            }}
                        >
                            Prev
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: accenturePurple,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px'
                            }}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: accenturePurple,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px'
                            }}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddPage;
