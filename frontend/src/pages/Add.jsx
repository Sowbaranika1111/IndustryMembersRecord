import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const accenturePurple = '#6a0dad';
const API_BASE_URL = 'http://localhost:5000';

const fieldLabels = {
    name: 'Name',
    email_address: 'Email Address',
    enterprise_id: 'Enterprise-id',
    management_level: 'Management Level',
    work_location: 'Work Location',
    project: 'Project',
    designation: 'Designation',
    current_role: 'Current Role',
    overall_experience_years: 'Overall Experience (Years)',
    overall_experience_months: 'Overall Experience (Months)',
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
    plm_admin_expertise: 'PLM Admin Expertise', // Keep this label
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
    management_level: Array.from({ length: 9 }, (_, i) => (i + 5).toString()),
    industry_knowledge: [
        'Automotive', 'Industrial', 'Aerospace', 'Medical Devices', 'Hitech', 'Resources', 'Consumer Goods', 'None', 'Multiple'
    ],
    overall_experience_years: Array.from({ length: 31 }, (_, i) => i.toString()), // 0 to 30 years
    overall_experience_months: Array.from({ length: 12 }, (_, i) => i.toString()), // 0 to 11 months
    development_expertise: ['Teamcenter ITK', 'Teamcenter SOA', 'TC Dispatcher'],
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

// Hardcoded PLM Admin Expertise options from your provided data
const plmAdminExpertiseOptionsData = [
    "BMIDE (Business Modeler IDE)",
    "Structure Manager",
    "Workflow Designer",
    "Access Manager",
    "Change Management"
];

const frontendToBackendKeyMap = {
    name: 'name',
    email_address: 'email_address',
    enterprise_id: 'enterpriseid',
    management_level: 'management_level',
    work_location: 'work_location',
    project: 'project',
    designation: 'designation',
    current_role: 'current_role',
    overall_experience_years: 'overall_experience_years',
    overall_experience_months: 'overall_experience_months',
    primary_skill: 'primary_skill',
    additional_skills: 'additional_skills',
    agile_project: 'agile_project',
    plm_development: 'plm_development',
    industry_knowledge: 'industry_knowledge',
    automation_skills: 'automation_skills',
    devops_skills: 'devops_skills',
    cloud_knowledge: 'cloud_knowledge',
    sw_engineering: 'sw_engineering',
    project_management: 'project_management',
    plm_testing: 'plm_testing',
    plm_support: 'plm_support',
    plm_admin: 'plm_admin',
    plm_admin_expertise: 'plm_admin_expertise',
    plm_upgrade: 'plm_upgrade',
    plm_cad_integration: 'plm_cad_integration',
    plm_interfaceintegration: 'plm_interfaceintegration',
    plm_sap_integration: 'plm_sap_integration',
    tc_manufacturing: 'tc_manufacturing',
    plmqms_integration: 'plmqms_integration',
    plm_functional: 'plm_functional',
    plm_migration: 'plm_migration',
    plm_product_configurators: 'plm_product_configurators',
    active_workspace_customization: 'active_workspace_customization',
    teamcenter_module_experience: 'teamcenter_module_experience',
    certifications_in_progress: 'certifications_in_progress',
    special_call_out: 'special_call_out'
};

const transformDataForBackend = (frontendData) => {
    const backendData = {};
    for (const frontendKey in frontendData) {
        if (frontendToBackendKeyMap.hasOwnProperty(frontendKey)) {
            const backendKey = frontendToBackendKeyMap[frontendKey];
            backendData[backendKey] = frontendData[frontendKey];
        } else if (frontendKey === 'external_certifications__completed_along_with_completion__expiry_date') {
            backendData['external_certifications__completed_along_with_completion__expiry_date'] = frontendData[frontendKey] || '';
        }
    }
    return backendData;
}

const AddPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(
        Object.keys(fieldLabels).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
    );
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
    const [stepChanging, setStepChanging] = useState(false);

    const stepFields = {
        1: ['name', 'email_address', 'enterprise_id', 'management_level', 'work_location', 'project', 'designation', 'current_role'],
        2: ['overall_experience_years', 'overall_experience_months', 'primary_skill', 'additional_skills', 'agile_project', 'plm_development', 'industry_knowledge', 'automation_skills', 'cloud_knowledge', 'devops_skills', 'sw_engineering', 'project_management', 'plm_testing', 'plm_support', 'plm_admin', 'plm_upgrade', 'plm_cad_integration', 'plm_interfaceintegration', 'plm_sap_integration', 'tc_manufacturing', 'plmqms_integration', 'plm_functional', 'plm_migration', 'plm_product_configurators', 'active_workspace_customization', 'teamcenter_module_experience'],
        3: ['external_certifications__completed_along_with_completion__expiry_date', 'certifications_in_progress', 'special_call_out']
    };
    const [dropdownData, setDropdownData] = useState({
        current_role: [],
        work_location: [],
        cloud_knowledge: [],
        project: [],
        designation: []
    });

    // We no longer need a state for plmAdminExpertiseOptions as it's hardcoded
    // const [plmAdminExpertiseOptions, setPlmAdminExpertiseOptions] = useState([]);

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [rolesRes, cloudRes, locationsRes, projectsRes, designationRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/current-role/getAllCurrentRoles`),
                    axios.get(`${API_BASE_URL}/api/cloud-knowledge`),
                    axios.get(`${API_BASE_URL}/api/work-location/getAllWorkLocations`),
                    axios.get(`${API_BASE_URL}/api/project-dropdown/`),
                    axios.get(`${API_BASE_URL}/api/designation/getAllDesignations`)
                ]);

                setDropdownData(prev => ({
                    ...prev,
                    current_role: rolesRes.data,
                    cloud_knowledge: cloudRes.data,
                    work_location: locationsRes.data,
                    project: projectsRes.data,
                    designation: designationRes.data
                }));
            } catch (err) {
                console.error("Error fetching dropdown data:", err);
            }
        };

        fetchDropdowns();
    }, []);

    // REMOVED: The useEffect hook that fetched plmAdminExpertiseOptions from the backend.
    /*
    useEffect(() => {
        const fetchPlmAdminExpertise = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/plm-admin-expertise/getAllExpertise`);
                console.log("PLM Admin Expertise fetched:", response.data);
                setPlmAdminExpertiseOptions(response.data);
            } catch (err) {
                console.error("Error fetching PLM Admin Expertise options:", err);
            }
        };

        if (formData.plm_admin && formData.plm_admin !== 'None') {
            fetchPlmAdminExpertise();
        } else {
            setFormData(prev => ({ ...prev, plm_admin_expertise: '' }));
            setPlmAdminExpertiseOptions([]);
        }
    }, [formData.plm_admin]);
    */

    useEffect(() => {
        if (stepChanging) {
            setStepChanging(false);
        }
    }, [step]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (submitStatus.message && submitStatus.type === 'error') {
            setSubmitStatus({ message: '', type: '' });
        }
    };

    const handleNext = () => {
        if (stepChanging) return;

        setSubmitStatus({ message: '', type: '' });
        setStepChanging(true);

        if (step === 1) {
            const step1MandatoryKeys = ['name', 'email_address', 'enterprise_id', 'management_level', 'work_location', 'project'];
            for (const fieldKey of step1MandatoryKeys) {
                if (!formData[fieldKey] || String(formData[fieldKey]).trim() === '') {
                    alert(`${fieldLabels[fieldKey]} is required to proceed to the next section.`);
                    setStepChanging(false);
                    return;
                }
            }
        } else if (step === 2) {
            const step2MandatoryKeys = ['overall_experience_years', 'overall_experience_months', 'primary_skill'];
            for (const fieldKey of step2MandatoryKeys) {
                if (!formData[fieldKey] || String(formData[fieldKey]).trim() === '') {
                    alert(`${fieldLabels[fieldKey]} is required to proceed to the next section.`);
                    setStepChanging(false);
                    return;
                }
            }
        }
        setStep((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (stepChanging) return;

        if (step > 1) {
            setSubmitStatus({ message: '', type: '' });
            setStepChanging(true);
            setStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (stepChanging) return;

        setSubmitting(true);
        setSubmitStatus({ message: '', type: '' });

        const schemaRequiredFrontendKeys = {
            'name': 'Name', 'email_address': 'Email Address', 'enterprise_id': 'Enterprise-id', 'primary_skill': 'Primary Skill',
            'additional_skills': 'Additional Skills', 'management_level': 'Management Level',
            'work_location': 'Work Location', 'project': 'Project', 'designation': 'Designation',
            'overall_experience_years': 'Overall Experience (Years)',
            'overall_experience_months': 'Overall Experience (Months)',
            'current_role': 'Current Role'
        };

        for (const feKey in schemaRequiredFrontendKeys) {
            if (!formData[feKey] || String(formData[feKey]).trim() === '') {
                setSubmitStatus({ message: `${schemaRequiredFrontendKeys[feKey]} is a required field. Please complete it.`, type: 'error' });
                setSubmitting(false);
                let errorStep = 1;
                for (const s_idx in stepFields) {
                    if (stepFields[s_idx].includes(feKey)) {
                        errorStep = parseInt(s_idx);
                        break;
                    }
                }
                setStepChanging(true);
                setStep(errorStep);
                return;
            }
        }

        const payload = transformDataForBackend(formData);

        try {
            await axios.post(`${API_BASE_URL}/api/batchmates`, payload);
            alert('Batchmate added successfully! Click OK to return to the homepage.');
            setFormData(Object.keys(fieldLabels).reduce((acc, key) => ({ ...acc, [key]: '' }), {}));
            setStepChanging(true);
            setStep(1);
            navigate('/');
        } catch (error) {
            let errorMessage = 'Failed to add batchmate. Please try again.';
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your network connection.';
            } else {
                errorMessage = 'An unexpected error occurred. Please try again.';
            }
            setSubmitStatus({ message: errorMessage, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (name) => {
        const apiOptions = dropdownData[name];
        const localOptions = dropdownOptions[name];

        let optionsToRender = [];
        let isApiDropdown = false;

        if (apiOptions && apiOptions.length > 0) {
            optionsToRender = apiOptions;
            isApiDropdown = true;
        } else if (localOptions && localOptions.length > 0) {
            optionsToRender = localOptions;
            isApiDropdown = false;
        }

        return (
            <div key={name} style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>{fieldLabels[name]}</label>
                {optionsToRender.length > 0 ? (
                    <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        style={{ width: '99%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        disabled={submitting || stepChanging}
                    >
                        <option value="">Select...</option>
                        {optionsToRender.map((opt, index) => {
                            let optionKey;
                            let optionValue;
                            let optionDisplay;

                            if (isApiDropdown) {
                                // For API dropdowns like current_role, work_location, etc.
                                // Assuming they have _id, id, name, or value properties
                                optionKey = opt._id || opt.id || JSON.stringify(opt) + index;
                                optionValue = opt.name || opt.value || ''; // Ensure a fallback for value
                                optionDisplay = opt.name || opt.value || ''; // Ensure a fallback for display
                            } else {
                                // For local dropdowns (simple arrays of strings)
                                optionKey = opt;
                                optionValue = opt;
                                optionDisplay = opt;
                            }

                            return (
                                <option key={optionKey} value={optionValue}>
                                    {optionDisplay}
                                </option>
                            );
                        })}
                    </select>
                ) : (
                    <input
                        type={name === 'email_address' ? 'email' : 'text'}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        style={{ width: '95%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        disabled={submitting || stepChanging}
                    />
                )}
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px', color: '#000' }}>
            {/* Stepper */}
            <div style={{ position: 'relative', marginBottom: '40px' }}>
                <div style={{ position: 'absolute', top: '15px', left: '7.5%', width: '85%', height: '2px', background: '#ccc', zIndex: 1 }} />
                <div style={{ position: 'absolute', top: '15px', left: '7.5%', width: `${(step - 1) * 42.5}%`, height: '2px', background: accenturePurple, transition: 'width 0.4s ease-in-out', zIndex: 2 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 3 }}>
                    {['Basic', 'Skills', 'Additional'].map((label, index) => (
                        <div key={label} style={{ textAlign: 'center', flex: 1 }}>
                            <div
                                style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    backgroundColor: step >= index + 1 ? accenturePurple : '#fff',
                                    border: `2px solid ${accenturePurple}`,
                                    color: step >= index + 1 ? '#fff' : accenturePurple,
                                    lineHeight: '30px', margin: 'auto', fontWeight: 'bold',
                                    transition: 'all 0.4s ease-in-out'
                                }}
                            >
                                {index + 1}
                            </div>
                            <div style={{ marginTop: '5px', fontWeight: step === index + 1 ? 'bold' : 'normal' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} style={{
                backgroundColor: '#fff', padding: '20px', borderRadius: '8px',
                border: `1px solid ${accenturePurple}`
            }}>
                {submitStatus.message && (
                    <div style={{
                        padding: '10px', marginBottom: '15px', borderRadius: '5px',
                        color: '#fff',
                        backgroundColor: submitStatus.type === 'success' ? '#28a745' : '#dc3545',
                        textAlign: 'center'
                    }}>
                        {submitStatus.message}
                    </div>
                )}

                {stepFields[step].map(fieldName => (
                    <React.Fragment key={fieldName}>
                        {renderField(fieldName)}
                        {/* Render PLM Admin Expertise dropdown separately if plm_admin is selected and not 'None' */}
                        {fieldName === 'plm_admin' && formData.plm_admin && formData.plm_admin !== 'None' && (
                            <div style={{ marginBottom: '15px', marginTop: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>{fieldLabels['plm_admin_expertise']}</label>
                                <select
                                    name="plm_admin_expertise"
                                    value={formData.plm_admin_expertise}
                                    onChange={handleChange}
                                    style={{ width: '99%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                    disabled={submitting || stepChanging}
                                >
                                    <option value="">Select...</option>
                                    {plmAdminExpertiseOptionsData.map((optValue, index) => (
                                        <option key={index} value={optValue}>
                                            {optValue}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </React.Fragment>
                ))}


                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handlePrev}
                            style={{
                                padding: '10px 20px', backgroundColor: '#fff',
                                color: accenturePurple, border: `2px solid ${accenturePurple}`,
                                borderRadius: '5px', cursor: 'pointer'
                            }}
                            disabled={submitting || stepChanging}
                        >
                            Prev
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            style={{
                                padding: '10px 20px', backgroundColor: accenturePurple,
                                color: '#fff', border: 'none', borderRadius: '5px',
                                cursor: 'pointer', marginLeft: step === 1 ? 'auto' : ''
                            }}
                            disabled={submitting || stepChanging}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px', backgroundColor: accenturePurple,
                                color: '#fff', border: 'none', borderRadius: '5px',
                                cursor: 'pointer', marginLeft: step === 1 ? 'auto' : ''
                            }}
                            disabled={submitting || stepChanging}
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddPage;