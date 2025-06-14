import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Define API_BASE_URL (make sure this matches your backend's base URL)
const API_BASE_URL = 'http://localhost:5000';

export default function Profile() {
    // Get the enterpriseId from the URL (e.g., 'john.doe' from '/profile/john.doe')
    const { enterpriseId } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Centered Avatar and Name Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#ccc',
                    backgroundImage: `url(https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(profileData.name || 'DefaultSeed')})`,
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
                    {profileData.name || 'N/A'}
                </h2>
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


            {/* Two-column Details Section */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '30px',
                    marginTop: '30px',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between'
                }}
            >
                {/* Left Column */}
                <div style={{
                    width: '100%',
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                    fontFamily: '"Roboto Condensed", sans-serif'
                }}>
                    <p><strong>Email:</strong> {profileData.email_address || 'N/A'}</p>
                    <p><strong>Primary Skill:</strong> {profileData.primary_skill || 'N/A'}</p>
                    <p><strong>Additional Skills:</strong> {profileData.additional_skills || 'N/A'}</p>
                    <p><strong>Overall Experience:</strong> {profileData.overall_experience || 'N/A'}</p>
                    <p><strong>Current Role:</strong> {profileData.current_role || 'N/A'}</p>
                    <p><strong>Industry Knowledge:</strong> {profileData.industry_knowledge || 'N/A'}</p>
                    <p><strong>Automation Skills:</strong> {profileData.automation_skills || 'N/A'}</p>
                    <p><strong>DevOps Skills:</strong> {profileData.devops_skills || 'N/A'}</p>
                    <p><strong>Cloud Knowledge:</strong> {profileData.cloud_knowledge || 'N/A'}</p>
                    <p><strong>Agile Project Experience:</strong> {profileData.agile_project || 'N/A'}</p>
                    <p><strong>PLM Development:</strong> {profileData.plm_development || 'N/A'}</p>
                    <p><strong>PLM Testing:</strong> {profileData.plm_testing || 'N/A'}</p>
                    <p><strong>PLM Support:</strong> {profileData.plm_support || 'N/A'}</p>
                    <p><strong>PLM Admin:</strong> {profileData.plm_admin || 'N/A'}</p>
                    <p><strong>PLM Upgrade:</strong> {profileData.plm_upgrade || 'N/A'}</p>
                </div>

                {/* Right Column */}
                <div style={{
                    width: '100%',
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                    fontFamily: '"Roboto Condensed", sans-serif'
                }}>
                    <p><strong>PLM CAD Integration:</strong> {profileData.plm_cad_integration || 'N/A'}</p>
                    <p><strong>PLM Interface Integration:</strong> {profileData.plm_interface_integration || 'N/A'}</p>
                    <p><strong>PLM SAP Integration:</strong> {profileData.plm_sap_integration || 'N/A'}</p>
                    <p><strong>TC Manufacturing:</strong> {profileData.tc_manufacturing || 'N/A'}</p>
                    <p><strong>PLM-QMS Integration:</strong> {profileData.plm_qms_integration || 'N/A'}</p>
                    <p><strong>Software Engineering:</strong> {profileData.software_engineering || 'N/A'}</p>
                    <p><strong>Project Management:</strong> {profileData.project_management || 'N/A'}</p>
                    <p><strong>PLM Functional:</strong> {profileData.plm_functional || 'N/A'}</p>
                    <p><strong>PLM Migration:</strong> {profileData.plm_migration || 'N/A'}</p>
                    <p><strong>PLM Product Configurators:</strong> {profileData.plm_product_configurators || 'N/A'}</p>
                    <p><strong>AWC Customization:</strong> {profileData.active_workspace_customization || 'N/A'}</p>
                    <p><strong>Teamcenter Module Experience:</strong> {profileData.teamcenter_module_experience || 'N/A'}</p>
                    <p><strong>Certifications:</strong> {profileData.external_certifications__completed_along_with_completion__expiry_date || 'N/A'}</p>
                    <p><strong>Certifications In Progress:</strong> {profileData.certifications_in_progress || 'N/A'}</p>
                    <p><strong>Special Call Out:</strong> {profileData.special_call_out || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}