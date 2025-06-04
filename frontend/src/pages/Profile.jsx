import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Added import for useParams
import axios from 'axios'; // Added import for axios

// Define API_BASE_URL (make sure this matches your backend's base URL)
const API_BASE_URL = 'http://localhost:5000';

// The initial static `data` object provided in your original code snippet is not
// directly used for rendering if the API call is successful and profileData is set.
// It primarily serves as a reference for the expected data structure.

export default function Profile() {
    const { batchmateId } = useParams(); // Get batchmateId from URL parameters
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!batchmateId) {
            setError("No batchmate ID provided.");
            setLoading(false);
            return;
        }

        const fetchProfileData = async () => {
            setLoading(true);
            setError('');
            try {
                // Updated API endpoint to match the pattern: /api/batchmates/id/:id
                const response = await axios.get(`${API_BASE_URL}/api/batchmates/id/${batchmateId}`);
                setProfileData(response.data);
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
    }, [batchmateId]); // Effect runs when batchmateId changes

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Loading profile...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: 'red' }}>Error: {error}</div>;
    }

    if (!profileData) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Profile data not available.</div>;
    }
    
    // Now, use profileData to render the UI.
    // The JSX below assumes your API returns data with snake_case keys
    // (e.g., job_profile, work_location) as indicated by the static `data` object
    // you provided in the problem description.

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Centered Avatar */}
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
            <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', marginTop: '30px', flexWrap: 'wrap' }}>
                {/* Left Box */}
                <div style={{
                    flex: '1 1 400px',
                    minWidth: '300px',
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
                </div>

                {/* Right Box */}
                <div style={{
                    flex: '1 1 400px',
                    minWidth: '300px',
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                    fontFamily: '"Roboto Condensed", sans-serif'
                }}>
                    <p><strong>DevOps Skills:</strong> {profileData.devops_skills || 'N/A'}</p>
                    <p><strong>Cloud Knowledge:</strong> {profileData.cloud_knowledge || 'N/A'}</p>
                    <p><strong>Agile Project Experience:</strong> {profileData.agile_project || 'N/A'}</p>
                    <p><strong>PLM Development Experience:</strong> {profileData.plm_development || 'N/A'}</p>
                    {/*
                      For certifications, the original static data object had:
                      `external_certifications__completed_along_with_completion__expiry_date: ""`
                      The original JSX had `data.externalCertifications?.completed`.
                      This is an inconsistency. The code below assumes the API returns a field named
                      `external_certifications__completed_along_with_completion__expiry_date` as a string.
                      If your API returns this data differently (e.g., as an object like 
                      `{ externalCertifications: { completed: "...", ... } }`),
                      you'll need to adjust this line accordingly.
                    */}
                    <p><strong>Certifications:</strong> {profileData.external_certifications__completed_along_with_completion__expiry_date || 'N/A'}</p>
                    <p><strong>Certifications In Progress:</strong> {profileData.certifications_in_progress || 'N/A'}</p>
                    <p><strong>Special Call Out:</strong> {profileData.special_call_out || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}