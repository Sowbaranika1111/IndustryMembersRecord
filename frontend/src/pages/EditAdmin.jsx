// src/components/EditUser.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const accenturePurple = '#6a0dad';
const API_BASE_URL = 'http://localhost:5000';

// NOTE: All constants (fieldLabels, dropdownOptions, etc.) from Add.jsx are preserved here.
// To save space, they are not repeated in this code block. Assume they are present.
const fieldLabels = {
    name: 'Name', email_address: 'Email Address', enterprise_id: 'Enterprise-id', management_level: 'Management Level', work_location: 'Work Location', project: 'Project', job_profile: 'Designation', current_role: 'Current Role', overall_experience_years: 'Overall Experience (Years)', overall_experience_months: 'Overall Experience (Months)', primary_skill: 'Primary Skill', additional_skills: 'Additional Skills', agile_project: 'Agile Project', plm_development: 'PLM Development', industry_knowledge: 'Industry Knowledge', automation_skills: 'Automation Skills', devops_skills: 'DevOps Skills', cloud_knowledge: 'Cloud Knowledge', sw_engineering: 'Software Engineering', project_management: 'Project Management', plm_testing: 'PLM Testing', plm_support: 'PLM Support', plm_admin: 'PLM Admin', plm_admin_expertise: 'PLM Admin Expertise', plm_upgrade: 'PLM Upgrade', plm_upgrade_expertise: 'PLM Upgrade Expertise', plm_upgrade_experience: 'PLM Upgrade Experience', plm_cad_integration: 'PLM CAD Integration', plm_interfaceintegration: 'PLM Interface/Integration', plm_sap_integration: 'PLM SAP Integration', tc_manufacturing: 'TC Manufacturing', plmqms_integration: 'PLM-QMS Integration', plm_functional: 'PLM Functional', plm_migration: 'PLM Migration', plm_product_configurators: 'PLM Product Configurators', active_workspace_customization: 'Active Workspace Customization', teamcenter_module_experience: 'Teamcenter Module Experience', external_certifications__completed_along_with_completion__expiry_date: 'Certifications (Completed)', certifications_in_progress: 'Certifications In Progress', special_call_out: 'Special Call Out', plm_development_expertise: 'PLM Development Expertise', plm_development_experience: 'PLM Development Experience', plm_admin_expertise_dropdown: 'PLM Admin Expertise', plm_admin_experience: 'PLM Admin Experience', plm_cad_integration_expertise: 'PLM CAD Integration Expertise', plm_cad_integration_experience: 'PLM CAD Integration Experience', project_delivery_model: 'Project Delivery Model', project_delivery_years: 'Years of Experience in Project Delivery Model', project_delivery_experience: 'Experience in Project Delivery Model', isUserActive: 'User Active Status', plm_testing_expertise: 'PLM Testing Expertise', plm_testing_experience: 'PLM Testing Experience', plm_support_expertise: 'PLM Support Expertise', plm_support_experience: 'PLM Support Experience', plm_integration_expertise: 'PLM Integration Expertise', plm_integration_experience: 'PLM Integration Experience',
};
const dropdownOptions = {
    management_level: Array.from({ length: 9 }, (_, i) => (i + 5).toString()), industry_knowledge: ['Automotive', 'Industrial', 'Aerospace', 'Medical Devices', 'Hitech', 'Resources', 'Consumer Goods', 'None', 'Multiple'], overall_experience_years: Array.from({ length: 31 }, (_, i) => i.toString()), overall_experience_months: Array.from({ length: 12 }, (_, i) => (i + 1).toString()), development_expertise: ['Teamcenter ITK', 'Teamcenter SOA', 'TC Dispatcher'], agile_project: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_development: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_testing: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_support: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_admin: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_upgrade: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_cad_integration: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_interfaceintegration: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_sap_integration: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], tc_manufacturing: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plmqms_integration: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], sw_engineering: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_functional: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_migration: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], plm_product_configurators: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], active_workspace_customization: ['<1', '1-2 yr', '2-5 yr', '5-8 yr', '8+ yr', 'Awareness', 'None'], project_delivery_years: ['<1', '1-3', '4-5', '6-7', '8+', 'Awareness'],
};
const frontendToBackendKeyMap = {
    name: 'name', email_address: 'email_address', enterprise_id: 'enterpriseid', management_level: 'management_level', work_location: 'work_location', project: 'project', job_profile: 'job_profile', current_role: 'current_role', overall_experience_years: 'overall_experience_years', overall_experience_months: 'overall_experience_months', primary_skill: 'primary_skill', additional_skills: 'additional_skills', agile_project: 'agile_project', plm_development: 'plm_development', plm_development_expertise: 'plm_development_expertise', plm_development_experience: 'plm_development_experience', industry_knowledge: 'industry_knowledge', automation_skills: 'automation_skills', devops_skills: 'devops_skills', cloud_knowledge: 'cloud_knowledge', sw_engineering: 'sw_engineering', project_management: 'project_management', plm_testing: 'plm_testing', plm_support: 'plm_support', plm_admin: 'plm_admin', plm_admin_expertise_dropdown: 'plm_admin_expertise', // Corrected Mapping
    plm_admin_experience: 'plm_admin_experience', plm_upgrade: 'plm_upgrade', plm_upgrade_expertise: 'plm_upgrade_expertise', plm_upgrade_experience: 'plm_upgrade_experience', plm_cad_integration: 'plm_cad_integration', plm_cad_integration_expertise: 'plm_cad_integration_expertise', plm_cad_integration_experience: 'plm_cad_integration_experience', plm_interfaceintegration: 'plm_interfaceintegration', plm_sap_integration: 'plm_sap_integration', tc_manufacturing: 'tc_manufacturing', plmqms_integration: 'plmqms_integration', plm_functional: 'plm_functional', plm_migration: 'plm_migration', plm_product_configurators: 'plm_product_configurators', active_workspace_customization: 'active_workspace_customization', teamcenter_module_experience: 'teamcenter_module_experience', project_delivery_model: 'project_delivery_model', project_delivery_years: 'project_delivery_years', project_delivery_experience: 'project_delivery_experience', certifications_in_progress: 'certifications_in_progress', special_call_out: 'special_call_out', external_certifications__completed_along_with_completion__expiry_date: 'external_certifications__completed_along_with_completion__expiry_date', isUserActive: 'isUserActive', plm_testing_expertise: 'plm_testing_expertise', plm_testing_experience: 'plm_testing_experience', plm_support_expertise: 'plm_support_expertise', plm_support_experience: 'plm_support_experience', plm_integration_expertise: 'plm_integration_expertise', plm_integration_experience: 'plm_integration_experience'
};

// Create a reverse map for populating form from backend data
const backendToFrontendKeyMap = Object.entries(frontendToBackendKeyMap).reduce((acc, [fe, be]) => {
  acc[be] = fe;
  return acc;
}, {});

const transformDataForFrontend = (backendData) => {
    const frontendData = {};
    for (const backendKey in backendData) {
        const frontendKey = backendToFrontendKeyMap[backendKey] || backendKey;
        // Ensure null/undefined values become empty strings for controlled components
        // Special handling for boolean fields like isUserActive
        if (frontendKey === 'isUserActive') {
            frontendData[frontendKey] = backendData[backendKey] !== null && backendData[backendKey] !== undefined ? backendData[backendKey] : true;
        } else {
            frontendData[frontendKey] = backendData[backendKey] != null ? backendData[backendKey] : '';
        }
    }
    return frontendData;
};

const transformDataForBackend = (frontendData) => {
    const backendData = {};
    for (const frontendKey in frontendData) {
        if (frontendToBackendKeyMap.hasOwnProperty(frontendKey)) {
            const backendKey = frontendToBackendKeyMap[frontendKey];
            // Special handling for boolean fields
            if (frontendKey === 'isUserActive') {
                backendData[backendKey] = Boolean(frontendData[frontendKey]);
            } else {
                backendData[backendKey] = frontendData[frontendKey];
            }
        }
    }
    return backendData;
}

const EditAdmin = () => {
    const navigate = useNavigate();
    const { emailId } = useParams(); // Get email ID from URL (without @accenture.com)
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(
        Object.keys(fieldLabels).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
    );
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
    const [stepChanging, setStepChanging] = useState(false);

    // All other state declarations (e.g., plmDevExpertiseOptions) from Add.jsx should be here.
    const [plmDevExpertiseOptions, setPlmDevExpertiseOptions] = useState([]);
    const [plmAdminExpertiseOptions, setPlmAdminExpertiseOptions] = useState([]);
    const [plmCadExpertiseOptions, setPlmCadExpertiseOptions] = useState([]);
    const [projectDeliveryModelOptions, setProjectDeliveryModelOptions] = useState([]);
    const [plmUpgradeExpertiseOptions, setPlmUpgradeExpertiseOptions] = useState([]);
    const [plmTestingExpertiseOptions, setPlmTestingExpertiseOptions] = useState([]);
    const [plmSupportExpertiseOptions, setPlmSupportExpertiseOptions] = useState([]);
    const [plmIntegrationExpertiseOptions, setPlmIntegrationExpertiseOptions] = useState([]);
    const stepFields = {
        1: ['name', 'email_address', 'enterprise_id', 'isUserActive', 'management_level', 'work_location', 'project', 'job_profile', 'current_role'],
        2: ['overall_experience_years', 'overall_experience_months', 'primary_skill', 'additional_skills', 'project_delivery_model', 'plm_development', 'industry_knowledge', 'automation_skills', 'cloud_knowledge', 'devops_skills', 'sw_engineering', 'project_management', 'plm_testing', 'plm_support', 'plm_admin', 'plm_upgrade', 'plm_cad_integration', 'plm_interfaceintegration', 'plm_sap_integration', 'tc_manufacturing', 'plmqms_integration', 'plm_functional', 'plm_migration', 'plm_product_configurators', 'active_workspace_customization', 'teamcenter_module_experience'],
        3: ['external_certifications__completed_along_with_completion__expiry_date', 'certifications_in_progress', 'special_call_out']
    };
    const [dropdownData, setDropdownData] = useState({
        current_role: [], work_location: [], cloud_knowledge: [], project: [], job_profile: [], project_delivery_model: [], devops_skills: []
    });


    // Fetch existing user data
    useEffect(() => {
        const fetchBatchmateData = async () => {
            try {
                setLoading(true);
                // Construct the full email address required by the API
                const emailAddress = `${emailId}@accenture.com`;
                
                // Fetch the user data from the email endpoint
                const response = await axios.get(`${API_BASE_URL}/api/batchmates/email?email=${emailAddress}`);
                console.log('Fetched batchmate data:', response.data.data);
                const initialData = transformDataForFrontend(response.data.data);
                console.log('Transformed form data:', initialData);
                setFormData(initialData);
            } catch (error) {
                console.error("Failed to fetch batchmate data:", error);
                setSubmitStatus({ message: 'Failed to load user data.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchBatchmateData();
    }, [emailId]);

    // All other useEffect hooks from Add.jsx should be here.
    // They will automatically work when formData is populated.
    useEffect(() => { /* For dropdowns */
        const fetchDropdowns = async () => {
            try {
                const [rolesRes, cloudRes, locationsRes, projectsRes, designationRes, projectDeliveryRes, developSkillsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/current-role`),
                    axios.get(`${API_BASE_URL}/api/cloud-knowledge`),
                    axios.get(`${API_BASE_URL}/api/work-location`),
                    axios.get(`${API_BASE_URL}/api/project`),
                    axios.get(`${API_BASE_URL}/api/designation`),
                    axios.get(`${API_BASE_URL}/api/project-delivery-models`),
                    axios.get(`${API_BASE_URL}/api/devops-skills`)
                ]);

                setDropdownData(prev => ({
                    ...prev,
                    current_role: rolesRes.data,
                    cloud_knowledge: cloudRes.data.data,
                    work_location: locationsRes.data.data,
                    project: projectsRes.data.data,
                    job_profile: designationRes.data.data,
                    project_delivery_model: projectDeliveryRes.data,
                    devops_skills: developSkillsRes.data.data
                }));
            } catch (err) {
                console.error("Error fetching dropdown data:", err);
            }
        };

        fetchDropdowns();
    }, []);
    useEffect(() => { /* For plm_development */
        if (formData.plm_development && formData.plm_development !== 'None') {
            axios.get(`${API_BASE_URL}/api/plm-dev-expertise/`).then(res => {
                setPlmDevExpertiseOptions(res.data.data || []);
            }).catch(() => setPlmDevExpertiseOptions([]));
        } else {
            setFormData(prev => ({ ...prev, plm_development_expertise: '', plm_development_experience: '' }));
            setPlmDevExpertiseOptions([]);
        }
    }, [formData.plm_development]);
    useEffect(() => { /* For plm_admin */
        if (formData.plm_admin && formData.plm_admin !== 'None') {
            axios.get(`${API_BASE_URL}/api/plm-admin-expertise/`).then(res => {
                setPlmAdminExpertiseOptions(res.data.data || []);
            }).catch(() => setPlmAdminExpertiseOptions([]));
        } else {
            setFormData(prev => ({ ...prev, plm_admin_expertise_dropdown: '', plm_admin_experience: '' }));
            setPlmAdminExpertiseOptions([]);
        }
    }, [formData.plm_admin]);
    useEffect(() => { /* For plm_cad_integration */
        if (formData.plm_cad_integration && formData.plm_cad_integration !== 'None') {
            axios.get(`${API_BASE_URL}/api/plm-cad-integrations/`).then(res => {
                setPlmCadExpertiseOptions(res.data || []);
            }).catch(() => setPlmCadExpertiseOptions([]));
        } else {
            setFormData(prev => ({ ...prev, plm_cad_integration_expertise: '', plm_cad_integration_experience: '' }));
            setPlmCadExpertiseOptions([]);
        }
    }, [formData.plm_cad_integration]);
    useEffect(() => { /* For project_delivery_model */
        axios.get(`${API_BASE_URL}/api/project-delivery-models/`).then(res => {
            setProjectDeliveryModelOptions(res.data || []);
        }).catch(() => setProjectDeliveryModelOptions([]));
    }, []);
    useEffect(() => { /* For plm_upgrade */
        if (formData.plm_upgrade && formData.plm_upgrade !== 'None') {
            axios.get(`${API_BASE_URL}/api/plm-upgrade-expertise/`).then(res => {
                setPlmUpgradeExpertiseOptions(res.data.data || []);
            }).catch(() => setPlmUpgradeExpertiseOptions([]));
        } else {
            setFormData(prev => ({ ...prev, plm_upgrade_expertise: '', plm_upgrade_experience: '' }));
            setPlmUpgradeExpertiseOptions([]);
        }
    }, [formData.plm_upgrade]);

    useEffect(() => {
        console.log('PLM Testing useEffect triggered:', formData.plm_testing);
        if (formData.plm_testing && formData.plm_testing !== 'None') {
            console.log('Fetching PLM Testing expertise...');
            axios.get(`${API_BASE_URL}/api/plm-testing-expertise`).then(res => {
                console.log('PLM Testing expertise response:', res.data);
                setPlmTestingExpertiseOptions(res.data.data || []);
            }).catch((err) => {
                console.error('Error fetching PLM Testing expertise:', err);
                setPlmTestingExpertiseOptions([]);
            });
        } else {
            console.log('Clearing PLM Testing expertise fields');
            setFormData(prev => ({ ...prev, plm_testing_expertise: '', plm_testing_experience: '' }));
            setPlmTestingExpertiseOptions([]);
        }
    }, [formData.plm_testing]);

    useEffect(() => {
        if (formData.plm_support && formData.plm_support !== 'None') {
            axios.get(`${API_BASE_URL}/api/plm-support-expertise`).then(res => {
                setPlmSupportExpertiseOptions(res.data.data || []);
            }).catch(() => setPlmSupportExpertiseOptions([]));
        } else {
            setFormData(prev => ({ ...prev, plm_support_expertise: '', plm_support_experience: '' }));
            setPlmSupportExpertiseOptions([]);
        }
    }, [formData.plm_support]);

    useEffect(() => {
        if (formData.plm_interfaceintegration && formData.plm_interfaceintegration !== 'None') {
            axios.get(`${API_BASE_URL}/api/plm-integration-expertise`).then(res => {
                setPlmIntegrationExpertiseOptions(res.data.data || []);
            }).catch(() => setPlmIntegrationExpertiseOptions([]));
        } else {
            setFormData(prev => ({ ...prev, plm_integration_expertise: '', plm_integration_experience: '' }));
            setPlmIntegrationExpertiseOptions([]);
        }
    }, [formData.plm_interfaceintegration]);

    // handleSubmit is updated for PUT request
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (stepChanging || submitting) return;
        setSubmitting(true);
        setSubmitStatus({ message: '', type: '' });


        const payload = transformDataForBackend(formData);
        
        try {
            // Use PUT to update the existing record using name parameter
            // The backend expects the name in the URL, so we'll use the name from formData
            const nameToUpdate = formData.name;
            if (!nameToUpdate) {
                throw new Error('Name is required for updating the profile');
            }
            
            await axios.put(`${API_BASE_URL}/api/batchmates/${encodeURIComponent(nameToUpdate)}`, payload);
            alert('Profile updated successfully! Click OK to return to the homepage.');
            navigate('/');
        } catch (error) {
            let errorMessage = 'Failed to update profile. Please try again.';
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            }
            setSubmitStatus({ message: errorMessage, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };
    
    // renderField is updated to handle readonly fields
    const renderField = (name) => {
        const isReadOnly = ['name', 'email_address', 'enterprise_id'].includes(name);
        const apiOptions = dropdownData[name];
        const localOptions = dropdownOptions[name];
        // ... same dropdown logic as in Add.jsx
        let optionsToRender = [];
        let isApiDropdown = false;
        if (apiOptions && apiOptions.length > 0) { optionsToRender = apiOptions; isApiDropdown = true; } 
        else if (localOptions && localOptions.length > 0) { optionsToRender = localOptions; isApiDropdown = false; }

        // Special handling for isUserActive checkbox
        if (name === 'isUserActive') {
            return (
                <div key={name} style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name={name}
                            checked={formData[name] || false}
                            onChange={handleChange}
                            style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                            disabled={submitting || stepChanging}
                        />
                        <span>{fieldLabels[name]}</span>
                    </label>
                </div>
            );
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
                            let optionKey, optionValue, optionDisplay;
                            if (isApiDropdown) {
                                optionKey = opt._id || opt.id || JSON.stringify(opt) + index;
                                optionValue = opt.name || opt.value || '';
                                optionDisplay = opt.name || opt.value || '';
                            } else {
                                optionKey = opt; optionValue = opt; optionDisplay = opt;
                            }
                            return (<option key={optionKey} value={optionValue}>{optionDisplay}</option>);
                        })}
                    </select>
                ) : (
                    <input
                        type={name === 'email_address' ? 'email' : 'text'}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        style={{
                            width: '95%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            backgroundColor: isReadOnly ? '#e9ecef' : '#fff' // Visual cue
                        }}
                        readOnly={isReadOnly}
                        disabled={submitting || stepChanging}
                    />
                )}
            </div>
        );
    };
    
    // The rest of the component (handleChange, handleNext, handlePrev, render* functions, and JSX)
    // is identical to Add.jsx, so it's omitted here for brevity.
    // Make sure to copy them from Add.jsx.
    // Key changes to make in the JSX:
    // 1. Change the main title, e.g., <h2>Edit Your Profile</h2>
    // 2. Change the submit button text from "Submit" to "Update".
    // 3. Add a loading indicator.
    const handleChange = (e) => { /* Copy from Add.jsx */
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox' && name === 'plm_development_expertise') {
            setFormData(prev => {
                const currentValues = prev[name] ? prev[name].split(',').filter(v => v.trim()) : [];
                let newValues;
                if (checked) { newValues = [...currentValues, value]; }
                else { newValues = currentValues.filter(v => v !== value); }
                return { ...prev, [name]: newValues.join(', ') };
            });
        } else if (type === 'checkbox') {
            // Handle other checkboxes like isUserActive
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (submitStatus.message && submitStatus.type === 'error') {
            setSubmitStatus({ message: '', type: '' });
        }
    };
    const handleNext = () => {
        console.log('handleNext called, stepChanging:', stepChanging, 'step:', step);
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
        console.log('Setting step to:', step + 1);
        setStep((prev) => prev + 1);
        setStepChanging(false);
    };
    const handlePrev = () => {
        console.log('handlePrev called, stepChanging:', stepChanging, 'step:', step);
        if (stepChanging) return;

        if (step > 1) {
            setSubmitStatus({ message: '', type: '' });
            setStepChanging(true);
            console.log('Setting step to:', step - 1);
            setStep((prev) => prev - 1);
            setStepChanging(false);
        }
    };

    // Reset stepChanging when step changes
    useEffect(() => {
        console.log('Step changed to:', step, 'Resetting stepChanging');
        const timer = setTimeout(() => {
            setStepChanging(false);
        }, 100);
        return () => clearTimeout(timer);
    }, [step]);

    const renderOverallExperience = () => {
        return (
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Overall Experience</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                        name="overall_experience_years"
                        value={formData.overall_experience_years}
                        onChange={handleChange}
                        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        disabled={submitting || stepChanging}
                    >
                        <option value="">Years</option>
                        {dropdownOptions.overall_experience_years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <select
                        name="overall_experience_months"
                        value={formData.overall_experience_months}
                        onChange={handleChange}
                        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        disabled={submitting || stepChanging}
                    >
                        <option value="">Months</option>
                        {dropdownOptions.overall_experience_months.map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    const renderPlmExtraFields = ({
        labelPrefix,
        expertiseOptions,
        expertiseField,
        experienceField,
        expertiseLabel,
        experienceLabel
    }) => (
        <div style={{
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            animation: 'slideDown 0.3s ease-in-out'
        }}>
            <div style={{ marginBottom: '15px', marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>{expertiseLabel}</label>
                {expertiseField === 'plm_development_expertise' ? (
                    // Multiple selection for PLM Development Expertise
                    <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                        {expertiseOptions.map((opt, idx) => {
                            const optionValue = opt.value || opt;
                            const currentValues = formData[expertiseField] ? formData[expertiseField].split(',').map(v => v.trim()) : [];
                            const isChecked = currentValues.includes(optionValue);
                            
                            return (
                                <div key={opt._id || idx} style={{ marginBottom: '8px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            name={expertiseField}
                                            value={optionValue}
                                            checked={isChecked}
                                            onChange={handleChange}
                                            style={{ marginRight: '8px' }}
                                            disabled={submitting || stepChanging}
                                        />
                                        <span>{optionValue}</span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Single selection for other fields
                    <select
                        name={expertiseField}
                        value={formData[expertiseField]}
                        onChange={handleChange}
                        style={{ width: '99%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        disabled={submitting || stepChanging}
                    >
                        <option value="">Select...</option>
                        {expertiseOptions.map((opt, idx) => (
                            <option key={opt._id || idx} value={opt.value}>{opt.value}</option>
                        ))}
                    </select>
                )}
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>{experienceLabel}</label>
                <textarea
                    name={experienceField}
                    value={formData[experienceField]}
                    onChange={handleChange}
                    style={{ width: '95%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '60px', resize: 'vertical' }}
                    disabled={submitting || stepChanging}
                />
            </div>
        </div>
    );

    const renderProjectDeliveryExtraFields = () => (
        <div style={{
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            animation: 'slideDown 0.3s ease-in-out'
        }}>
            <div style={{ marginBottom: '15px', marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>{fieldLabels['project_delivery_years']}</label>
                <select
                    name="project_delivery_years"
                    value={formData.project_delivery_years}
                    onChange={handleChange}
                    style={{ width: '99%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    disabled={submitting || stepChanging}
                >
                    <option value="">Select...</option>
                    {dropdownOptions.project_delivery_years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>{fieldLabels['project_delivery_experience']}</label>
                <textarea
                    name="project_delivery_experience"
                    value={formData.project_delivery_experience}
                    onChange={handleChange}
                    style={{ width: '97%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '60px', resize: 'vertical' }}
                    disabled={submitting || stepChanging}
                />
            </div>
        </div>
    );

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Profile...</div>;
    }

    return (
        <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px', color: '#000' }}>
            <style>
                {`
                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                            max-height: 0;
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                            max-height: 200px;
                        }
                    }
                `}
            </style>
            
            <h2 style={{ textAlign: 'center', color: accenturePurple, marginBottom: '20px' }}>Edit Profile</h2>
            
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

                {stepFields[step].map(fieldName => {
                    console.log('Rendering field:', fieldName, 'for step:', step);
                    return (
                        <React.Fragment key={fieldName}>
                            {/* Render combined Overall Experience field */}
                            {fieldName === 'overall_experience_years' && renderOverallExperience()}
                            {/* Skip rendering the individual year/month fields */}
                            {fieldName !== 'overall_experience_years' && fieldName !== 'overall_experience_months' && renderField(fieldName)}
                            {/* Render PLM Dev extra fields if plm_development is not None */}
                            {fieldName === 'plm_development' && formData.plm_development && formData.plm_development !== 'None' && renderPlmExtraFields({
                                labelPrefix: 'PLM Development',
                                expertiseOptions: plmDevExpertiseOptions,
                                expertiseField: 'plm_development_expertise',
                                experienceField: 'plm_development_experience',
                                expertiseLabel: fieldLabels['plm_development_expertise'],
                                experienceLabel: fieldLabels['plm_development_experience']
                            })}
                            {/* Render PLM Admin extra fields if plm_admin is not None */}
                            {fieldName === 'plm_admin' && formData.plm_admin && formData.plm_admin !== 'None' && renderPlmExtraFields({
                                labelPrefix: 'PLM Admin',
                                expertiseOptions: plmAdminExpertiseOptions,
                                expertiseField: 'plm_admin_expertise_dropdown',
                                experienceField: 'plm_admin_experience',
                                expertiseLabel: fieldLabels['plm_admin_expertise_dropdown'],
                                experienceLabel: fieldLabels['plm_admin_experience']
                            })}
                            {/* Render PLM CAD Integration extra fields if plm_cad_integration is not None */}
                            {fieldName === 'plm_cad_integration' && formData.plm_cad_integration && formData.plm_cad_integration !== 'None' && renderPlmExtraFields({
                                labelPrefix: 'PLM CAD Integration',
                                expertiseOptions: plmCadExpertiseOptions,
                                expertiseField: 'plm_cad_integration_expertise',
                                experienceField: 'plm_cad_integration_experience',
                                expertiseLabel: fieldLabels['plm_cad_integration_expertise'],
                                experienceLabel: fieldLabels['plm_cad_integration_experience']
                            })}
                            {/* Render PLM Upgrade extra fields if plm_upgrade is not None */}
                            {fieldName === 'plm_upgrade' && formData.plm_upgrade && formData.plm_upgrade !== 'None' && renderPlmExtraFields({
                                labelPrefix: 'PLM Upgrade',
                                expertiseOptions: plmUpgradeExpertiseOptions,
                                expertiseField: 'plm_upgrade_expertise',
                                experienceField: 'plm_upgrade_experience',
                                expertiseLabel: fieldLabels['plm_upgrade_expertise'],
                                experienceLabel: fieldLabels['plm_upgrade_experience']
                            })}
                            {/* Render PLM Testing extra fields if plm_testing is not None */}
                            {fieldName === 'plm_testing' && formData.plm_testing && formData.plm_testing !== 'None' && renderPlmExtraFields({
                                labelPrefix: 'PLM Testing',
                                expertiseOptions: plmTestingExpertiseOptions,
                                expertiseField: 'plm_testing_expertise',
                                experienceField: 'plm_testing_experience',
                                expertiseLabel: fieldLabels['plm_testing_expertise'],
                                experienceLabel: fieldLabels['plm_testing_experience']
                            })}
                            {/* Render PLM Support extra fields if plm_support is not None */}
                            {fieldName === 'plm_support' && formData.plm_support && formData.plm_support !== 'None' && renderPlmExtraFields({
                                labelPrefix: 'PLM Support',
                                expertiseOptions: plmSupportExpertiseOptions,
                                expertiseField: 'plm_support_expertise',
                                experienceField: 'plm_support_experience',
                                expertiseLabel: fieldLabels['plm_support_expertise'],
                                experienceLabel: fieldLabels['plm_support_experience']
                            })}
                            {/* Render PLM Integration extra fields if plm_interfaceintegration is not None */}
                            {fieldName === 'plm_interfaceintegration' && formData.plm_interfaceintegration && formData.plm_interfaceintegration !== 'None' && renderPlmExtraFields({
                                labelPrefix: 'PLM Integration',
                                expertiseOptions: plmIntegrationExpertiseOptions,
                                expertiseField: 'plm_integration_expertise',
                                experienceField: 'plm_integration_experience',
                                expertiseLabel: fieldLabels['plm_integration_expertise'],
                                experienceLabel: fieldLabels['plm_integration_experience']
                            })}
                            {/* Render Project Delivery Model extra fields if project_delivery_model is selected */}
                            {fieldName === 'project_delivery_model' && formData.project_delivery_model && formData.project_delivery_model !== '' && renderProjectDeliveryExtraFields()}
                        </React.Fragment>
                    );
                })}

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
                            {submitting ? 'Updating...' : 'Update Profile'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditAdmin;