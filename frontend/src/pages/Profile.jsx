import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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

    // Conditional rendering for loading state
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Loading profile...</div>;
    }

    // Conditional rendering for error state
    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: 'red' }}>Error: {error}</div>;
    }

    // Conditional rendering if no data is found after loading
    if (!profileData) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Profile data not available.</div>;
    }

    // Main JSX rendering using the fetched profileData
    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Logout Confirmation Modal */}
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
                                style={{
                                    padding: '8px 22px',
                                    background: '#f0f0f0',
                                    color: '#333',
                                    border: 'none',
                                    borderRadius: '5px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    transition: 'background 0.2s',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setShowLogoutModal(false);
                                    await logout();
                                    navigate('/');
                                }}
                                style={{
                                    padding: '8px 22px',
                                    background: '#A100FF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    transition: 'background 0.2s',
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Centered Avatar and Name Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#ccc',
                    backgroundImage: `url(https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=6a0dad&color=fff&size=120&font-size=0.4&bold=true&length=2)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginBottom: '10px'
                }}></div>
                
                {/* Name with Edit Icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                    <h2 style={{
                        margin: '0',
                        fontWeight: '700',
                        fontSize: '28px',
                        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                        color: '#2e2e2e'
                    }}>
                        {profileData.name || 'N/A'}
                    </h2>
                    {/* Edit Icon - only show if user can edit */}
                    {canEdit() && (
                        <button
                            onClick={handleEdit}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '5px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s ease',
                                marginRight: '0px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f0f0f0';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            title={user?.role === 'admin' ? 'Edit Profile (Admin Mode)' : 'Edit Profile (User Mode)'}
                        >
                            <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#6a0dad" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                    )}
                    {/* Logout Icon - only show if user is logged in */}
                    {user && (
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '5px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#ffe6f0';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            title="Logout"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#d32f2f"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    )}
                </div>
                
                <p style={{
                    margin: '6px 0',
                    fontSize: '16px',
                    fontFamily: '"Roboto", sans-serif',
                    color: '#555',
                    textAlign: 'center'
                }}>
                    {profileData.job_profile || 'N/A'} | {profileData.work_location || 'N/A'} | Level {profileData.management_level || 'N/A'}
                </p>
                <p style={{
                    margin: '0',
                    fontSize: '15px',
                    fontStyle: 'italic',
                    fontFamily: '"Georgia", serif',
                    color: '#6a6a6a'
                }}>
                    Project: {profileData.project || 'N/A'}
                </p>
            </div>

            {/* Three-column Details Section */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '20px',
                    marginTop: '30px',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                }}
            >
                {/* Left Column - Basic Information */}
                <div style={{
                    flex: '1',
                    minWidth: '300px',
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                    fontFamily: '"Roboto Condensed", sans-serif'
                }}>
                    <h3 style={{ color: '#6a0dad', marginBottom: '15px', borderBottom: '2px solid #6a0dad', paddingBottom: '5px' }}>
                        Basic Information
                    </h3>
                    <p><strong>Email:</strong> {profileData.email_address || 'N/A'}</p>
                    <p><strong>Enterprise ID:</strong> {profileData.enterpriseid || 'N/A'}</p>
                    <p><strong>Designation:</strong> {profileData.job_profile || 'N/A'}</p>
                    <p><strong>Current Role:</strong> {profileData.current_role || 'N/A'}</p>
                    <p><strong>Overall Experience:</strong> {renderExperience(profileData.overall_experience_years, profileData.overall_experience_months)}</p>
                    <p><strong>Primary Skill:</strong> {profileData.primary_skill || 'N/A'}</p>
                    <p><strong>Additional Skills:</strong> {profileData.additional_skills || 'N/A'}</p>
                    <p><strong>Industry Knowledge:</strong> {profileData.industry_knowledge || 'N/A'}</p>
                    <p><strong>Automation Skills:</strong> {profileData.automation_skills || 'N/A'}</p>
                    <p><strong>DevOps Skills:</strong> {profileData.devops_skills || 'N/A'}</p>
                    <p><strong>Cloud Knowledge:</strong> {profileData.cloud_knowledge || 'N/A'}</p>
                    <p><strong>Software Engineering:</strong> {profileData.sw_engineering || 'N/A'}</p>
                    <p><strong>Agile Project Experience:</strong> {profileData.agile_project || 'N/A'}</p>
                    <p><strong>Project Management:</strong> {profileData.project_management || 'N/A'}</p>
                </div>

                {/* Middle Column - PLM Skills */}
                <div style={{
                    flex: '1',
                    minWidth: '300px',
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                    fontFamily: '"Roboto Condensed", sans-serif'
                }}>
                    <h3 style={{ color: '#6a0dad', marginBottom: '15px', borderBottom: '2px solid #6a0dad', paddingBottom: '5px' }}>
                        PLM Skills & Expertise
                    </h3>
                    <p><strong>PLM Development:</strong> {profileData.plm_development || 'N/A'}</p>
                    {profileData.plm_development && profileData.plm_development !== 'None' && (
                        <>
                            <p style={{ marginLeft: '20px' }}><strong>Expertise:</strong> {profileData.plm_development_expertise || 'N/A'}</p>
                            <p style={{ marginLeft: '20px' }}><strong>Experience:</strong> {profileData.plm_development_experience || 'N/A'}</p>
                        </>
                    )}
                    <p><strong>PLM Testing:</strong> {profileData.plm_testing || 'N/A'}</p>
                    {profileData.plm_testing && profileData.plm_testing !== 'None' && (
                        <>
                            <p style={{ marginLeft: '20px' }}><strong>Expertise:</strong> {profileData.plm_testing_expertise || 'N/A'}</p>
                            <p style={{ marginLeft: '20px' }}><strong>Experience:</strong> {profileData.plm_testing_experience || 'N/A'}</p>
                        </>
                    )}
                    <p><strong>PLM Support:</strong> {profileData.plm_support || 'N/A'}</p>
                    {profileData.plm_support && profileData.plm_support !== 'None' && (
                        <>
                            <p style={{ marginLeft: '20px' }}><strong>Expertise:</strong> {profileData.plm_support_expertise || 'N/A'}</p>
                            <p style={{ marginLeft: '20px' }}><strong>Experience:</strong> {profileData.plm_support_experience || 'N/A'}</p>
                        </>
                    )}
                    <p><strong>PLM Admin:</strong> {profileData.plm_admin || 'N/A'}</p>
                    {profileData.plm_admin && profileData.plm_admin !== 'None' && (
                        <>
                            <p style={{ marginLeft: '20px' }}><strong>Expertise:</strong> {profileData.plm_admin_expertise || 'N/A'}</p>
                            <p style={{ marginLeft: '20px' }}><strong>Experience:</strong> {profileData.plm_admin_experience || 'N/A'}</p>
                        </>
                    )}
                    <p><strong>PLM Upgrade:</strong> {profileData.plm_upgrade || 'N/A'}</p>
                    {profileData.plm_upgrade && profileData.plm_upgrade !== 'None' && (
                        <>
                            <p style={{ marginLeft: '20px' }}><strong>Expertise:</strong> {profileData.plm_upgrade_expertise || 'N/A'}</p>
                            <p style={{ marginLeft: '20px' }}><strong>Experience:</strong> {profileData.plm_upgrade_experience || 'N/A'}</p>
                        </>
                    )}
                    <p><strong>PLM CAD Integration:</strong> {profileData.plm_cad_integration || 'N/A'}</p>
                    {profileData.plm_cad_integration && profileData.plm_cad_integration !== 'None' && (
                        <>
                            <p style={{ marginLeft: '20px' }}><strong>Expertise:</strong> {profileData.plm_cad_integration_expertise || 'N/A'}</p>
                            <p style={{ marginLeft: '20px' }}><strong>Experience:</strong> {profileData.plm_cad_integration_experience || 'N/A'}</p>
                        </>
                    )}
                    <p><strong>PLM Interface/Integration:</strong> {profileData.plm_interfaceintegration || 'N/A'}</p>
                    {profileData.plm_interfaceintegration && profileData.plm_interfaceintegration !== 'None' && (
                        <>
                            <p style={{ marginLeft: '20px' }}><strong>Expertise:</strong> {profileData.plm_integration_expertise || 'N/A'}</p>
                            <p style={{ marginLeft: '20px' }}><strong>Experience:</strong> {profileData.plm_integration_experience || 'N/A'}</p>
                        </>
                    )}
                    <p><strong>PLM SAP Integration:</strong> {profileData.plm_sap_integration || 'N/A'}</p>
                    <p><strong>TC Manufacturing:</strong> {profileData.tc_manufacturing || 'N/A'}</p>
                    <p><strong>PLM-QMS Integration:</strong> {profileData.plmqms_integration || 'N/A'}</p>
                    <p><strong>PLM Functional:</strong> {profileData.plm_functional || 'N/A'}</p>
                    <p><strong>PLM Migration:</strong> {profileData.plm_migration || 'N/A'}</p>
                    <p><strong>PLM Product Configurators:</strong> {profileData.plm_product_configurators || 'N/A'}</p>
                    <p><strong>Active Workspace Customization:</strong> {profileData.active_workspace_customization || 'N/A'}</p>
                    <p><strong>Teamcenter Module Experience:</strong> {profileData.teamcenter_module_experience || 'N/A'}</p>
                </div>

                {/* Right Column - Project & Certifications */}
                <div style={{
                    flex: '1',
                    minWidth: '300px',
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                    fontFamily: '"Roboto Condensed", sans-serif'
                }}>
                    <h3 style={{ color: '#6a0dad', marginBottom: '15px', borderBottom: '2px solid #6a0dad', paddingBottom: '5px' }}>
                        Project & Certifications
                    </h3>
                    <p><strong>Project Delivery Model:</strong> {profileData.project_delivery_model || 'N/A'}</p>
                    {profileData.project_delivery_model && profileData.project_delivery_model !== '' && (
                        <>
                            <p style={{ marginLeft: '20px' }}><strong>Years:</strong> {profileData.project_delivery_years || 'N/A'}</p>
                            <p style={{ marginLeft: '20px' }}><strong>Experience:</strong> {profileData.project_delivery_experience || 'N/A'}</p>
                        </>
                    )}
                    <p><strong>Completed Certifications:</strong> {profileData.external_certifications__completed_along_with_completion__expiry_date || 'N/A'}</p>
                    <p><strong>Certifications In Progress:</strong> {profileData.certifications_in_progress || 'N/A'}</p>
                    <p><strong>Special Call Out:</strong> {profileData.special_call_out || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}