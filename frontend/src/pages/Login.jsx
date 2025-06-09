import React, { useState } from 'react';
// Note: This component uses react-router-dom for navigation.
// Ensure your app has it installed (`npm install react-router-dom`)
// and this component is rendered within a <BrowserRouter>.
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // State for the multi-step flow ('enterId' or 'enterOtp')
    const [step, setStep] = useState('enterId');

    // State for form inputs
    const [enterpriseId, setEnterpriseId] = useState('');
    const [otp, setOtp] = useState('');

    // State for logic and feedback
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Generates a 6-digit OTP and logs it for testing
    const generateAndShowOtp = () => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        // For testing purposes, we log the OTP to the console.
        // In a real application, this would be sent via SMS/email.
        console.log(`Generated OTP for ${enterpriseId}: ${newOtp}`);
        setGeneratedOtp(newOtp);
    };

    // Handles the submission of the Enterprise ID
    const handleIdSubmit = (event) => {
        event.preventDefault();
        if (enterpriseId.trim() === '') {
            setError('Enterprise ID cannot be empty.');
            return;
        }
        setError('');
        generateAndShowOtp();
        setStep('enterOtp'); // Move to the next step
    };

    // Handles the verification of the OTP
    const handleOtpSubmit = (event) => {
        event.preventDefault();
        if (otp === generatedOtp) {
            setError('');
            // On successful login, navigate to the home page
            navigate('/home');
        } else {
            setError('OTP mismatched. Please try again.');
            setOtp(''); // Clear OTP input on failure
        }
    };

    const handleGoBack = () => {
        setStep('enterId');
        setError('');
        setOtp('');
        setEnterpriseId('');
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
          max-width: 450px; /* Adjusted max-width for a cleaner look */
          box-sizing: border-box;
        }

        .login-header {
  display: flex;         /* Use Flexbox for simple alignment */
  align-items: center;   /* Vertically align the logo and title */
  gap: 15px;             /* The space between the logo and title */
  margin-bottom: 35px;
}

.logo-container {
  /* No special styles needed, it's a flex item */
  /* line-height: 0 helps prevent extra space if the image is inline */
  line-height: 0; 
}

.accenture-logo {
  width: 45px;
  height: 45px;
}

/* The h1 is now a simple flex item next to the logo */
.login-header h1 {
  font-size: 1.8em;
  color: var(--text-dark);
  margin: 0;
  font-weight: 600;
  /* All the complex grid and padding properties are removed */
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
        
        .error-message {
            color: var(--error-color);
            font-size: 14px;
            text-align: center;
            margin-bottom: 15px;
        }
        
        .change-id-link {
            font-size: 13px;
            color: var(--text-link);
            text-decoration: underline;
            cursor: pointer;
            display: inline-block;
            margin-top: 5px;
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
                                    placeholder="e.g., juile.sweet"
                                    autoFocus
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="submit-btn">
                                Next
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit}>
                             <div className="form-group otp-info">
                                An OTP has been sent to the registered device for <strong>{enterpriseId}</strong>.
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
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="submit-btn">
                                Verify & Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default Login;