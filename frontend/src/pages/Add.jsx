import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const accenturePurple = '#6a0dad';
const API_BASE_URL = 'http://localhost:5000';

const fieldLabels = {
    name: 'Name',
    email_address: 'Email Address',
    enterprise_id: 'Enterprise-id',
    management_level: 'Management Level',
    work_location: 'Work Location',
    project: 'Project',
    job_profile: 'Designation',
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
    plm_admin_expertise: 'PLM Admin Expertise',
    plm_upgrade: 'PLM Upgrade',
    plm_upgrade_expertise: 'PLM Upgrade Expertise',
    plm_upgrade_experience: 'PLM Upgrade Experience',
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
    special_call_out: 'Special Call Out',
    plm_development_expertise: 'PLM Development Expertise',
    plm_development_experience: 'PLM Development Experience',
    plm_admin_expertise_dropdown: 'PLM Admin Expertise',
    plm_admin_experience: 'PLM Admin Experience',
    plm_cad_integration_expertise: 'PLM CAD Integration Expertise',
    plm_cad_integration_experience: 'PLM CAD Integration Experience',
    project_delivery_model: 'Project Delivery Model',
    project_delivery_years: 'Years of Experience in Project Delivery Model',
    project_delivery_experience: 'Experience in Project Delivery Model',
    plm_testing_expertise: 'PLM Testing Expertise',
    plm_testing_experience: 'PLM Testing Experience',
    plm_support_expertise: 'PLM Support Expertise',
    plm_support_experience: 'PLM Support Experience',
    plm_integration_expertise: 'PLM Integration Expertise',
    plm_integration_experience: 'PLM Integration Experience',
};

const dropdownOptions = {
    management_level: Array.from({ length: 9 }, (_, i) => (i + 5).toString()),
    industry_knowledge: [
        'Automotive', 'Industrial', 'Aerospace', 'Medical Devices', 'Hitech', 'Resources', 'Consumer Goods', 'None', 'Multiple'
    ],
    overall_experience_years: Array.from({ length: 31 }, (_, i) => i.toString()), // 0 to 30 years
    overall_experience_months: Array.from({ length: 12 }, (_, i) => (i + 1).toString()), // 1 to 12 months
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
    project_delivery_years: ['<1', '1-3', '4-5', '6-7', '8+', 'Awareness'],
};

const frontendToBackendKeyMap = {
    name: 'name',
    email_address: 'email_address',
    enterprise_id: 'enterpriseid',
    management_level: 'management_level',
    work_location: 'work_location',
    project: 'project',
    job_profile: 'job_profile',
    current_role: 'current_role',
    overall_experience_years: 'overall_experience_years',
    overall_experience_months: 'overall_experience_months',
    primary_skill: 'primary_skill',
    additional_skills: 'additional_skills',
    agile_project: 'agile_project',
    plm_development: 'plm_development',
    plm_development_expertise: 'plm_development_expertise',
    plm_development_experience: 'plm_development_experience',
    industry_knowledge: 'industry_knowledge',
    automation_skills: 'automation_skills',
    devops_skills: 'devops_skills',
    cloud_knowledge: 'cloud_knowledge',
    sw_engineering: 'sw_engineering',
    project_management: 'project_management',
    plm_testing: 'plm_testing',
    plm_support: 'plm_support',
    plm_admin: 'plm_admin',
    plm_admin_expertise_dropdown: 'plm_admin_expertise_dropdown',
    plm_admin_experience: 'plm_admin_experience',
    plm_upgrade: 'plm_upgrade',
    plm_upgrade_expertise: 'plm_upgrade_expertise',
    plm_upgrade_experience: 'plm_upgrade_experience',
    plm_cad_integration: 'plm_cad_integration',
    plm_cad_integration_expertise: 'plm_cad_integration_expertise',
    plm_cad_integration_experience: 'plm_cad_integration_experience',
    plm_interfaceintegration: 'plm_interfaceintegration',
    plm_sap_integration: 'plm_sap_integration',
    tc_manufacturing: 'tc_manufacturing',
    plmqms_integration: 'plmqms_integration',
    plm_functional: 'plm_functional',
    plm_migration: 'plm_migration',
    plm_product_configurators: 'plm_product_configurators',
    active_workspace_customization: 'active_workspace_customization',
    teamcenter_module_experience: 'teamcenter_module_experience',
    project_delivery_model: 'project_delivery_model',
    project_delivery_years: 'project_delivery_years',
    project_delivery_experience: 'project_delivery_experience',
    certifications_in_progress: 'certifications_in_progress',
    special_call_out: 'special_call_out',
    plm_testing_expertise: 'plm_testing_expertise',
    plm_testing_experience: 'plm_testing_experience',
    plm_support_expertise: 'plm_support_expertise',
    plm_support_experience: 'plm_support_experience',
    plm_integration_expertise: 'plm_integration_expertise',
    plm_integration_experience: 'plm_integration_experience'
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
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(
        Object.keys(fieldLabels).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
    );
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
    const [stepChanging, setStepChanging] = useState(false);
    const [plmDevExpertiseOptions, setPlmDevExpertiseOptions] = useState([]);
    const [plmAdminExpertiseOptions, setPlmAdminExpertiseOptions] = useState([]);
    const [plmCadExpertiseOptions, setPlmCadExpertiseOptions] = useState([]);
    const [projectDeliveryModelOptions, setProjectDeliveryModelOptions] = useState([]);
    const [plmUpgradeExpertiseOptions, setPlmUpgradeExpertiseOptions] = useState([]);
    const [plmTestingExpertiseOptions, setPlmTestingExpertiseOptions] = useState([]);
    const [plmSupportExpertiseOptions, setPlmSupportExpertiseOptions] = useState([]);
    const [plmIntegrationExpertiseOptions, setPlmIntegrationExpertiseOptions] = useState([]);

    const stepFields = {
        1: ['name', 'email_address', 'enterprise_id', 'management_level', 'work_location', 'project', 'job_profile', 'current_role'],
        2: ['overall_experience_years', 'overall_experience_months', 'primary_skill', 'additional_skills', 'project_delivery_model', 'plm_development', 'industry_knowledge', 'automation_skills', 'cloud_knowledge', 'devops_skills', 'sw_engineering', 'project_management', 'plm_testing', 'plm_support', 'plm_admin', 'plm_upgrade', 'plm_cad_integration', 'plm_interfaceintegration', 'plm_sap_integration', 'tc_manufacturing', 'plmqms_integration', 'plm_functional', 'plm_migration', 'plm_product_configurators', 'active_workspace_customization', 'teamcenter_module_experience'],
        3: ['external_certifications__completed_along_with_completion__expiry_date', 'certifications_in_progress', 'special_call_out']
    };
    const [dropdownData, setDropdownData] = useState({
        current_role: [],
        work_location: [],
        cloud_knowledge: [],
        project: [],
        job_profile: [],
        project_delivery_model: [], 
        devops_skills: []
    });

    useEffect(() => {
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

    useEffect(() => {
        if (formData.plm_development && formData.plm_development !== 'None') {
            axios.get(`${API_BASE_URL}/api/plm-dev-expertise/`).then(res => {
                setPlmDevExpertiseOptions(res.data.data || []);
            }).catch(() => setPlmDevExpertiseOptions([]));
        } else {
            setFormData(prev => ({ ...prev, plm_development_expertise: '', plm_development_experience: '' }));
            setPlmDevExpertiseOptions([]);
        }
    }, [formData.plm_development]);

    useEffect(() => {
        if (formData.plm_admin && formData.plm_admin !== 'None') {
            axios.get(`${API_BASE_URL}/api/plm-admin-expertise/`).then(res => {
                setPlmAdminExpertiseOptions(res.data.data || []);
            }).catch(() => setPlmAdminExpertiseOptions([]));
        } else {
            setFormData(prev => ({ ...prev, plm_admin_expertise_dropdown: '', plm_admin_experience: '' }));
            setPlmAdminExpertiseOptions([]);
        }
    }, [formData.plm_admin]);

    useEffect(() => {
        if (formData.plm_cad_integration && formData.plm_cad_integration !== 'None') {
            axios.get(`${API_BASE_URL}/api/plm-cad-integrations/`).then(res => {
                setPlmCadExpertiseOptions(res.data || []);
            }).catch(() => setPlmCadExpertiseOptions([]));
        } else {
            setFormData(prev => ({ ...prev, plm_cad_integration_expertise: '', plm_cad_integration_experience: '' }));
            setPlmCadExpertiseOptions([]);
        }
    }, [formData.plm_cad_integration]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/project-delivery-models/`).then(res => {
            setProjectDeliveryModelOptions(res.data || []);
        }).catch(() => setProjectDeliveryModelOptions([]));
    }, []);

    useEffect(() => {
        if (stepChanging) {
            setStepChanging(false);
        }
    }, [step]);

    useEffect(() => {
        if (formData.project_delivery_model && formData.project_delivery_model !== '') {
            // Keep the fields if a value is selected
        } else {
            setFormData(prev => ({ ...prev, project_delivery_years: '', project_delivery_experience: '' }));
        }
    }, [formData.project_delivery_model]);

    useEffect(() => {
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
        if (formData.plm_testing && formData.plm_testing !== 'None') {
            axios.get(`${API_BASE_URL}/api/plm-testing-expertise`).then(res => {
                setPlmTestingExpertiseOptions(res.data.data || []);
            }).catch(() => setPlmTestingExpertiseOptions([]));
        } else {
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox' && name === 'plm_development_expertise') {
            // Handle multiple selection for PLM Development Expertise
            setFormData(prev => {
                const currentValues = prev[name] ? prev[name].split(',').filter(v => v.trim()) : [];
                let newValues;
                
                if (checked) {
                    // Add value if not already present
                    newValues = [...currentValues, value];
                } else {
                    // Remove value if present
                    newValues = currentValues.filter(v => v !== value);
                }
                return { ...prev, [name]: newValues.join(', ') };
            });
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        
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
            setSubmitStatus({ message: 'Step 1 completed! Moving to Skills section...', type: 'success' });
        } else if (step === 2) {
            const step2MandatoryKeys = ['overall_experience_years', 'overall_experience_months', 'primary_skill'];
            for (const fieldKey of step2MandatoryKeys) {
                if (!formData[fieldKey] || String(formData[fieldKey]).trim() === '') {
                    alert(`${fieldLabels[fieldKey]} is required to proceed to the next section.`);
                    setStepChanging(false);
                    return;
                }
            }
            setSubmitStatus({ message: 'Step 2 completed! Moving to Additional Information section...', type: 'success' });
        }
        
        setTimeout(() => {
            setStep((prev) => prev + 1);
            setStepChanging(false);
        }, 1000);
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
            'work_location': 'Work Location', 'project': 'Project', 'job_profile': 'Designation',
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
            await axios.post(`${API_BASE_URL}/api/batchmates/add`, payload);
            alert('Batchmate added successfully! Click OK to view your profile.');
            setFormData(Object.keys(fieldLabels).reduce((acc, key) => ({ ...acc, [key]: '' }), {}));
            setStepChanging(true);
            setStep(1);
            
            // Redirect to profile page based on user role
            if (user && user.role === 'admin') {
                navigate('/home');
            } else if (user && user.email) {
                const userEnterpriseId = user.email.split('@')[0];
                navigate(`/profile/${userEnterpriseId}`);
            } else {
                navigate('/home');
            }
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

        // Define required fields
        const requiredFields = ['name', 'email_address', 'enterprise_id', 'management_level', 'work_location', 'project', 'job_profile', 'current_role', 'overall_experience_years', 'overall_experience_months', 'primary_skill'];
        const isRequired = requiredFields.includes(name);

        // Define placeholders for different field types
        const getPlaceholder = (fieldName) => {
            const placeholders = {
                name: 'Enter your full name',
                email_address: 'Enter your email address (e.g., john.doe@accenture.com)',
                enterprise_id: 'Enter your enterprise ID (e.g., john.doe)',
                management_level: 'Select your management level',
                work_location: 'Select your work location',
                project: 'Select your project',
                job_profile: 'Select your designation',
                current_role: 'Select your current role',
                overall_experience_years: 'Select years of experience',
                overall_experience_months: 'Select months of experience',
                primary_skill: 'Enter your primary skill',
                additional_skills: 'Enter additional skills (comma separated)',
                agile_project: 'Select agile project experience',
                plm_development: 'Select PLM development experience',
                industry_knowledge: 'Select industry knowledge',
                automation_skills: 'Enter automation skills',
                devops_skills: 'Select DevOps skills',
                cloud_knowledge: 'Select cloud knowledge',
                sw_engineering: 'Select software engineering experience',
                project_management: 'Enter project management experience',
                plm_testing: 'Select PLM testing experience',
                plm_support: 'Select PLM support experience',
                plm_admin: 'Select PLM admin experience',
                plm_upgrade: 'Select PLM upgrade experience',
                plm_cad_integration: 'Select PLM CAD integration experience',
                plm_interfaceintegration: 'Select PLM interface/integration experience',
                plm_sap_integration: 'Select PLM SAP integration experience',
                tc_manufacturing: 'Select TC manufacturing experience',
                plmqms_integration: 'Select PLM-QMS integration experience',
                plm_functional: 'Select PLM functional experience',
                plm_migration: 'Select PLM migration experience',
                plm_product_configurators: 'Select PLM product configurators experience',
                active_workspace_customization: 'Select Active Workspace customization experience',
                teamcenter_module_experience: 'Enter Teamcenter module experience',
                external_certifications__completed_along_with_completion__expiry_date: 'Enter completed certifications with completion/expiry dates',
                certifications_in_progress: 'Enter certifications in progress',
                special_call_out: 'Enter any special call outs or achievements',
                project_delivery_model: 'Select project delivery model',
                project_delivery_years: 'Select years in project delivery model',
                project_delivery_experience: 'Describe your experience in project delivery model',
                plm_development_expertise: 'Select PLM development expertise',
                plm_development_experience: 'Describe your PLM development experience',
                plm_admin_expertise_dropdown: 'Select PLM admin expertise',
                plm_admin_experience: 'Describe your PLM admin experience',
                plm_cad_integration_expertise: 'Select PLM CAD integration expertise',
                plm_cad_integration_experience: 'Describe your PLM CAD integration experience',
                plm_upgrade_expertise: 'Select PLM upgrade expertise',
                plm_upgrade_experience: 'Describe your PLM upgrade experience',
                plm_testing_expertise: 'Select PLM testing expertise',
                plm_testing_experience: 'Describe your PLM testing experience',
                plm_support_expertise: 'Select PLM support expertise',
                plm_support_experience: 'Describe your PLM support experience',
                plm_integration_expertise: 'Select PLM integration expertise',
                plm_integration_experience: 'Describe your PLM integration experience'
            };
            return placeholders[fieldName] || `Enter ${fieldLabels[fieldName]?.toLowerCase() || fieldName.replace(/_/g, ' ')}`;
        };

        return (
            <div key={name} style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    {fieldLabels[name]}
                    {isRequired && <span style={{ color: 'red', marginLeft: '2px' }}>*</span>}
                </label>
                {optionsToRender.length > 0 ? (
                    <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        style={{ width: '99%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        disabled={submitting || stepChanging}
                    >
                        <option value="">{getPlaceholder(name)}</option>
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
                        placeholder={getPlaceholder(name)}
                        style={{ width: '95%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        disabled={submitting || stepChanging}
                    />
                )}
            </div>
        );
    };

    const renderOverallExperience = () => {
        return (
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    Overall Experience
                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                        name="overall_experience_years"
                        value={formData.overall_experience_years}
                        onChange={handleChange}
                        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        disabled={submitting || stepChanging}
                    >
                        <option value="">Select years of experience</option>
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
                        <option value="">Select months of experience</option>
                        {dropdownOptions.overall_experience_months.map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    // Reusable function for PLM extra fields
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
                        <option value="">Select {expertiseLabel.toLowerCase()}</option>
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
                    placeholder={`Describe your ${experienceLabel.toLowerCase()}`}
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
                    <option value="">Select years in project delivery model</option>
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
                    placeholder="Describe your experience in project delivery model"
                    style={{ width: '97%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '60px', resize: 'vertical' }}
                    disabled={submitting || stepChanging}
                />
            </div>
        </div>
    );

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

            {/* Progress Indicator */}
            <div style={{ 
                marginBottom: '20px', 
                padding: '10px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '5px',
                border: '1px solid #dee2e6'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: accenturePurple }}>
                        Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Skills & Experience' : 'Additional Information'}
                    </span>
                    <span style={{ color: '#6c757d' }}>
                        {step === 3 ? 'Ready to submit!' : `${Math.round((step / 3) * 100)}% Complete`}
                    </span>
                </div>
                <div style={{ 
                    marginTop: '8px', 
                    height: '4px', 
                    backgroundColor: '#e9ecef', 
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <div style={{ 
                        width: `${(step / 3) * 100}%`, 
                        height: '100%', 
                        backgroundColor: accenturePurple,
                        transition: 'width 0.4s ease-in-out'
                    }} />
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
                            ← Previous
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
                            Next Step →
                        </button>
                    ) : (
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px', backgroundColor: '#28a745',
                                color: '#fff', border: 'none', borderRadius: '5px',
                                cursor: 'pointer', marginLeft: step === 1 ? 'auto' : '',
                                fontWeight: 'bold'
                            }}
                            disabled={submitting || stepChanging}
                        >
                            {submitting ? 'Submitting...' : '✓ Submit Form'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddPage;