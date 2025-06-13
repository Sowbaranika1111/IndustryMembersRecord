import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Configure axios to send cookies with every request
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend URL
    withCredentials: true,
});

const Login = () => {
    const [step, setStep] = useState('enterId');
    const [enterpriseId, setEnterpriseId] = useState('');
    const [otp, setOtp] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // For UX feedback
    
    const navigate = useNavigate();

    const handleIdSubmit = async (event) => {
        event.preventDefault();
        if (enterpriseId.trim() === '') {
            setError('Enterprise ID cannot be empty.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/login/generate-otp', { enterpriseId });
            setStep('enterOtp'); // Move to the next step on success
        } catch (err) {
            const message = err.response?.data?.message || 'An error occurred. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // THIS FUNCTION CONTAINS THE REQUIRED UPDATES
    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        if (otp.length !== 6) {
            setError('Please enter a 6-digit OTP.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/login/verify-otp', { enterpriseId, otp });
            
            // Role-based navigation logic
            if (response.data.success) {
                const user = response.data.user;

                if (user.role === 'admin') {
                    // If user is an admin, navigate to the main search/dashboard page
                    navigate('/home');
                } else {
                    // If user is a standard user, navigate directly to their own profile page
                    const userEnterpriseId = user.email.split('@')[0];
                    navigate(`/profile/${userEnterpriseId}`);
                }
            }
        } catch (err) {
            const message = err.response?.data?.message || 'An error occurred during verification.';
            setError(message);
            setOtp(''); // Clear OTP input on failure
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoBack = () => {
        setStep('enterId');
        setError('');
        setOtp('');
        // Keep enterpriseId so user doesn't have to re-type it
    };

    return (
        <>
            {/* --- STYLES --- */}
            <style>{`
                :root {
                  --accenture-purple: #A100FF;
                  --accenture-purple-dark: #8e00e6;
                  --text-dark: #212121;
                  --text-light: #5f5f5f;
                  --text-link: #4a4a4a;
                  --border-color: #dcdcdc;
                  --background-light: #f5f5f5;
                  --background-white: #ffffff;
                  --error-color: #d32f2f;
                }
        
                .login-page-container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background-color: var(--background-light);
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                }
        
                .login-container {
                  background: var(--background-white);
                  padding: 40px 50px;
                  border-radius: 12px;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                  width: 100%;
                  max-width: 450px;
                  box-sizing: border-box;
                }
        
                .login-header {
                  display: flex;
                  align-items: center;
                  gap: 15px;
                  margin-bottom: 35px;
                }
        
                .logo-container {
                  line-height: 0; 
                }
        
                .accenture-logo {
                  width: 45px;
                  height: 45px;
                }
        
                .login-header h1 {
                  font-size: 1.8em;
                  color: var(--text-dark);
                  margin: 0;
                  font-weight: 600;
                }
        
                .form-group {
                  margin-bottom: 25px;
                }
                
                .form-group.otp-info {
                  margin-bottom: 15px;
                  color: var(--text-light);
                  font-size: 14px;
                }
        
                .form-group label {
                  display: block;
                  font-size: 14px;
                  color: var(--text-light);
                  margin-bottom: 8px;
                  font-weight: 500;
                }
        
                .form-input {
                  width: 100%;
                  padding: 14px;
                  font-size: 16px;
                  border: 1px solid var(--border-color);
                  border-radius: 8px;
                  box-sizing: border-box;
                  transition: border-color 0.3s, box-shadow 0.3s;
                }
        
                .form-input:focus {
                  outline: none;
                  border-color: var(--accenture-purple);
                  box-shadow: 0 0 0 3px rgba(161, 0, 255, 0.15);
                }
        
                .submit-btn {
                  width: 100%;
                  padding: 15px;
                  font-size: 16px;
                  font-weight: bold;
                  color: var(--background-white);
                  background-color: var(--accenture-purple);
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
                  margin-top: 10px;
                }
        
                .submit-btn:hover {
                  background-color: var(--accenture-purple-dark);
                }

                .submit-btn:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                
                .error-message {
                    color: var(--error-color);
                    font-size: 14px;
                    text-align: center;
                    margin-bottom: 15px;
                    min-height: 1.2em;
                }
                
                .change-id-link {
                    font-size: 13px;
                    color: var(--text-link);
                    text-decoration: underline;
                    cursor: pointer;
                    display: inline-block;
                    margin-top: 5px;
                    margin-left: 10px;
                }
            `}</style>

            {/* --- COMPONENT JSX --- */}
            <div className="login-page-container">
                <div className="login-container">
                    <div className="login-header">
                        <div className="logo-container">
                            <img src="/ACN.svg" alt="Logo" className="accenture-logo" />
                        </div>
                        <h1>IX Engineering</h1>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    {step === 'enterId' ? (
                        <form onSubmit={handleIdSubmit}>
                            <div className="form-group">
                                <label htmlFor="enterpriseId">Enterprise ID</label>
                                <input
                                    type="text"
                                    id="enterpriseId"
                                    className="form-input"
                                    value={enterpriseId}
                                    onChange={(e) => setEnterpriseId(e.target.value)}
                                    placeholder="e.g., john.doe"
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit}>
                             <div className="form-group otp-info">
                                An OTP has been sent to <strong>{enterpriseId}@accenture.com</strong>.
                                <span onClick={handleGoBack} className="change-id-link">Change ID</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="otp">Enter 6-Digit OTP</label>
                                <input
                                    type="text"
                                    id="otp"
                                    className="form-input"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="••••••"
                                    maxLength="6"
                                    pattern="[0-9]{6}"
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default Login;