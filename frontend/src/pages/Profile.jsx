import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../index.css';

// Define API_BASE_URL (make sure this matches your backend's base URL)
const API_BASE_URL = 'http://localhost:5000';

export default function Profile() {
    // Get the enterpriseId from the URL (e.g., 'john.doe' from '/profile/john.doe')
    const { enterpriseId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        // This effect runs whenever the enterpriseId in the URL changes.
        if (!enterpriseId) {
            setError("No enterprise ID provided in the URL.");
            setLoading(false);
            return;
        }

        const fetchProfileData = async () => {
            setLoading(true);
            setError('');
            try {
                // Construct the full email address required by the API
                const emailAddress = `${enterpriseId}@accenture.com`;
                
                // Fetch the user data from the correct endpoint using the email
                const response = await axios.get(`${API_BASE_URL}/api/batchmates/email?email=${emailAddress}`);
                
                // Store the fetched profile data in the component's state
                setProfileData(response.data.data);
            } catch (err) {
                console.error("Error fetching profile data:", err);
                if (err.response) {
                    setError(err.response.data.message || `Error: Request failed with status ${err.response.status}`);
                } else if (err.request) {
                    setError("No response from server. Please check your network connection.");
                } else {
                    setError("An unexpected error occurred while fetching profile data.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [enterpriseId]); // The dependency array ensures this runs again if the ID changes

    // Check if current user can edit this profile
    const canEdit = () => {
        if (!user || !profileData) return false;
        
        // Admin can edit any profile
        if (user.role === 'admin') return true;
        
        // User can only edit their own profile
        const currentUserEnterpriseId = user.enterpriseId || user.email_address?.split('@')[0];
        return currentUserEnterpriseId === enterpriseId;
    };

    // Handle edit navigation
    const handleEdit = () => {
        // Automatically select edit form based on logged-in user's role
        if (user?.role === 'admin') {
            // Admin users always go to EditAdmin form
            navigate(`/edit-admin/${enterpriseId}`);
        } else {
            // Regular users always go to EditUser form
            navigate(`/edit-user/${enterpriseId}`);
        }
    };

    // Helper function to render experience with years and months
    const renderExperience = (years, months) => {
        const yearText = years ? `${years} Years` : '';
        const monthText = months ? `${months} Months` : '';
        if (yearText && monthText) {
            return `${yearText} ${monthText}`;
        } else if (yearText) {
            return yearText;
        } else if (monthText) {
            return monthText;
        }
        return 'N/A';
    };

    // Helper: Calculate profile completion (dummy logic for now)
    const getProfileCompletion = () => {
        if (!profileData) return 0;
        let filled = 0;
        let total = 15; // Adjust as needed for real completion logic
        if (profileData.name) filled++;
        if (profileData.email_address) filled++;
        if (profileData.job_profile) filled++;
        if (profileData.primary_skill) filled++;
        if (profileData.project) filled++;
        if (profileData.overall_experience_years || profileData.overall_experience_months) filled++;
        if (profileData.certifications_in_progress) filled++;
        if (profileData.external_certifications__completed_along_with_completion__expiry_date) filled++;
        if (profileData.plm_development) filled++;
        if (profileData.plm_testing) filled++;
        if (profileData.plm_support) filled++;
        if (profileData.plm_admin) filled++;
        if (profileData.plm_upgrade) filled++;
        if (profileData.plm_cad_integration) filled++;
        if (profileData.plm_interfaceintegration) filled++;
        return Math.round((filled / total) * 100);
    };

    // Helper: Get top 3-5 skills (dummy logic: pick non-empty, prioritize primary, then others)
    const getTopSkills = () => {
        const skills = [];
        if (profileData.primary_skill) skills.push(profileData.primary_skill);
        if (profileData.additional_skills) skills.push(...profileData.additional_skills.split(',').map(s => s.trim()).filter(Boolean));
        if (profileData.devops_skills) skills.push(...profileData.devops_skills.split(',').map(s => s.trim()).filter(Boolean));
        if (profileData.cloud_knowledge) skills.push(...profileData.cloud_knowledge.split(',').map(s => s.trim()).filter(Boolean));
        return [...new Set(skills)].slice(0, 5);
    };

    // Helper: Render skill badge
    const SkillBadge = ({ skill }) => (
        <span className="ix-skill-badge">{skill}</span>
    );

    // Helper: Render level tag
    const LevelTag = ({ level }) => {
        if (!level) return null;
        let color = '#bbb', text = 'Awareness';
        if (/expert/i.test(level)) { color = '#6a0dad'; text = 'Expert'; }
        else if (/good|proficient/i.test(level)) { color = '#4caf50'; text = 'Good'; }
        else if (/beginner|basic/i.test(level)) { color = '#ff9800'; text = 'Beginner'; }
        return <span className="ix-level-tag" style={{ background: color }}>{text}</span>;
    };

    // Conditional rendering for loading state
    if (loading) {
        return <div className="ix-profile-state">Loading profile...</div>;
    }

    // Conditional rendering for error state
    if (error) {
        return <div className="ix-profile-state ix-profile-state-error">Error: {error}</div>;
    }

    // Conditional rendering if no data is found after loading
    if (!profileData) {
        return <div className="ix-profile-state ix-profile-state-empty">Profile data not available.</div>;
    }

    // Main JSX rendering using the fetched profileData
    return (
        <div className="ix-profile-root">
            {/* Profile Completion Indicator */}
            {/* <div className="ix-profile-completion">
                <div className="ix-profile-completion-bar" style={{ width: `${getProfileCompletion()}%` }} />
                <span className="ix-profile-completion-label">Profile {getProfileCompletion()}% complete</span>
            </div> */}
            {/* Centered Avatar and Name Section */}
            <div className="ix-profile-header">
                <div className="ix-avatar-ring">
                    <div className="ix-avatar-img" style={{
                        backgroundImage: `url(https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=6a0dad&color=fff&size=120&font-size=0.4&bold=true&length=2)`
                    }}></div>
                </div>
                <div className="ix-profile-name-row">
                    <h2 className="ix-profile-name">{profileData.name || 'N/A'}</h2>
                    {canEdit() && (
                        <button className="ix-profile-edit-btn" onClick={handleEdit} title={user?.role === 'admin' ? 'Edit Profile (Admin Mode)' : 'Edit Profile (User Mode)'}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a0dad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                    )}
                    {user && (
                        <button className="ix-profile-logout-btn" onClick={() => setShowLogoutModal(true)} title="Logout">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        </button>
                    )}
                </div>
                <div className="ix-profile-meta">
                    <span>{profileData.job_profile || 'N/A'}</span>
                    <span className="ix-profile-dot">•</span>
                    <span>{profileData.work_location || 'N/A'}</span>
                    <span className="ix-profile-dot">•</span>
                    <span>Level {profileData.management_level || 'N/A'}</span>
                </div>
                <div className="ix-profile-project">Project: {profileData.project || 'N/A'}</div>
            </div>
            {/* Top Skills Section */}
            <div className="ix-profile-topskills">
                <span className="ix-profile-topskills-label">Top Skills:</span>
                {getTopSkills().length === 0 ? <span className="ix-profile-topskills-none">N/A</span> : getTopSkills().map(skill => <SkillBadge key={skill} skill={skill} />)}
            </div>
            {/* Three-column Details Section */}
            <div className="ix-profile-sections">
                {/* Left Column - Basic Information */}
                <div className="ix-profile-card ix-profile-basic">
                    <h3 className="ix-profile-section-title">Basic Information</h3>
                    <ul className="ix-profile-list">
                        <li><span className="ix-profile-label">Email:</span> <span className="ix-profile-value">{profileData.email_address || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Enterprise ID:</span> <span className="ix-profile-value">{profileData.enterpriseid || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Designation:</span> <span className="ix-profile-value">{profileData.job_profile || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Current Role:</span> <span className="ix-profile-value">{profileData.current_role || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Overall Experience:</span> <span className="ix-profile-value">{renderExperience(profileData.overall_experience_years, profileData.overall_experience_months)}</span></li>
                        <li><span className="ix-profile-label">Primary Skill:</span> <SkillBadge skill={profileData.primary_skill || 'N/A'} /></li>
                        <li><span className="ix-profile-label">Additional Skills:</span> {profileData.additional_skills ? profileData.additional_skills.split(',').map(skill => <SkillBadge key={skill} skill={skill.trim()} />) : <span className="ix-profile-value">N/A</span>}</li>
                        <li><span className="ix-profile-label">Industry Knowledge:</span> <span className="ix-profile-value">{profileData.industry_knowledge || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Automation Skills:</span> <span className="ix-profile-value">{profileData.automation_skills || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">DevOps Skills:</span> {profileData.devops_skills ? profileData.devops_skills.split(',').map(skill => <SkillBadge key={skill} skill={skill.trim()} />) : <span className="ix-profile-value">N/A</span>}</li>
                        <li><span className="ix-profile-label">Cloud Knowledge:</span> {profileData.cloud_knowledge ? profileData.cloud_knowledge.split(',').map(skill => <SkillBadge key={skill} skill={skill.trim()} />) : <span className="ix-profile-value">N/A</span>}</li>
                        <li><span className="ix-profile-label">Software Engineering:</span> <span className="ix-profile-value">{profileData.sw_engineering || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Agile Project Experience:</span> <span className="ix-profile-value">{profileData.agile_project || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Project Management:</span> <span className="ix-profile-value">{profileData.project_management || 'N/A'}</span></li>
                    </ul>
                </div>
                {/* Middle Column - PLM Skills */}
                <div className="ix-profile-card ix-profile-skills">
                    <h3 className="ix-profile-section-title">PLM Skills & Expertise</h3>
                    <ul className="ix-profile-list">
                        <li><span className="ix-profile-label">PLM Development:</span> <span className="ix-profile-value">{profileData.plm_development || 'N/A'} <LevelTag level={profileData.plm_development_expertise} /></span></li>
                        <li><span className="ix-profile-label">PLM Testing:</span> <span className="ix-profile-value">{profileData.plm_testing || 'N/A'} <LevelTag level={profileData.plm_testing_expertise} /></span></li>
                        <li><span className="ix-profile-label">PLM Support:</span> <span className="ix-profile-value">{profileData.plm_support || 'N/A'} <LevelTag level={profileData.plm_support_expertise} /></span></li>
                        <li><span className="ix-profile-label">PLM Admin:</span> <span className="ix-profile-value">{profileData.plm_admin || 'N/A'} <LevelTag level={profileData.plm_admin_expertise} /></span></li>
                        <li><span className="ix-profile-label">PLM Upgrade:</span> <span className="ix-profile-value">{profileData.plm_upgrade || 'N/A'} <LevelTag level={profileData.plm_upgrade_expertise} /></span></li>
                        <li><span className="ix-profile-label">PLM CAD Integration:</span> <span className="ix-profile-value">{profileData.plm_cad_integration || 'N/A'} <LevelTag level={profileData.plm_cad_integration_expertise} /></span></li>
                        <li><span className="ix-profile-label">PLM Interface/Integration:</span> <span className="ix-profile-value">{profileData.plm_interfaceintegration || 'N/A'} <LevelTag level={profileData.plm_integration_expertise} /></span></li>
                        <li><span className="ix-profile-label">PLM SAP Integration:</span> <span className="ix-profile-value">{profileData.plm_sap_integration || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">TC Manufacturing:</span> <span className="ix-profile-value">{profileData.tc_manufacturing || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">PLM-QMS Integration:</span> <span className="ix-profile-value">{profileData.plmqms_integration || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">PLM Functional:</span> <span className="ix-profile-value">{profileData.plm_functional || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">PLM Migration:</span> <span className="ix-profile-value">{profileData.plm_migration || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">PLM Product Configurators:</span> <span className="ix-profile-value">{profileData.plm_product_configurators || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Active Workspace Customization:</span> <span className="ix-profile-value">{profileData.active_workspace_customization || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Teamcenter Module Experience:</span> <span className="ix-profile-value">{profileData.teamcenter_module_experience || 'N/A'}</span></li>
                    </ul>
                </div>
                {/* Right Column - Project & Certifications */}
                <div className="ix-profile-card ix-profile-projects">
                    <h3 className="ix-profile-section-title">Project & Certifications</h3>
                    <ul className="ix-profile-list">
                        <li><span className="ix-profile-label">Project Delivery Model:</span> <span className="ix-profile-value">{profileData.project_delivery_model || 'N/A'}</span></li>
                        {profileData.project_delivery_model && profileData.project_delivery_model !== '' && (
                            <>
                                <li className="ix-profile-subitem"><span className="ix-profile-label">Years:</span> <span className="ix-profile-value">{profileData.project_delivery_years || 'N/A'}</span></li>
                                <li className="ix-profile-subitem"><span className="ix-profile-label">Experience:</span> <span className="ix-profile-value">{profileData.project_delivery_experience || 'N/A'}</span></li>
                            </>
                        )}
                        <li><span className="ix-profile-label">Completed Certifications:</span> <span className="ix-profile-value">{profileData.external_certifications__completed_along_with_completion__expiry_date || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Certifications In Progress:</span> <span className="ix-profile-value">{profileData.certifications_in_progress || 'N/A'}</span></li>
                        <li><span className="ix-profile-label">Special Call Out:</span> <span className="ix-profile-value">{profileData.special_call_out || 'N/A'}</span></li>
                    </ul>
                    <div className="ix-profile-actions">
                        <button className="ix-btn ix-profile-action-btn" disabled>View Resume</button>
                        {canEdit() && <button className="ix-btn ix-profile-action-btn" onClick={handleEdit}>Edit Profile</button>}
                    </div>
                </div>
            </div>
            {/* Logout Modal (unchanged) */}
            {showLogoutModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '32px 28px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        minWidth: '320px',
                        textAlign: 'center',
                        fontFamily: 'Segoe UI, sans-serif'
                    }}>
                        <div style={{ fontSize: '22px', fontWeight: 600, marginBottom: '12px', color: '#A100FF' }}>Confirm Logout</div>
                        <div style={{ fontSize: '16px', marginBottom: '28px', color: '#333' }}>
                            Are you sure you want to logout?
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px' }}>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="ix-btn"
                                style={{ background: '#f0f0f0', color: '#333' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setShowLogoutModal(false);
                                    await logout();
                                    navigate('/');
                                }}
                                className="ix-btn"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}