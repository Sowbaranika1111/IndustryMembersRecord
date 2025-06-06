import React, { useState } from 'react';

// For a real-world app, this SVG would likely be a separate file.
// For this example, it's embedded as a component for simplicity.
const AccentureLogo = () => (
    <svg
        className="accenture-logo"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor" // This allows the color to be set via CSS
    >
        <path d="M722.9 835.9H301.1L489.2 512 301.1 188.1h421.8L533.1 512z" />
    </svg>
);

const Login = () => {
    const [enterpriseId, setEnterpriseId] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');

    const handleSubmit = (event) => {
        event.preventDefault(); 
        console.log({
            enterpriseId,
            password,
            role,
        });
        alert(`Login submitted for ${enterpriseId} with role ${role}`);
    };

    return (
        <>
            <style>{`
        :root {
        --accenture-purple: #A100FF;
        --accenture-purple-dark: #8e00e6;
        --text-dark: #212121;
        --text-light: #5f5f5f;
        --border-color: #dcdcdc;
        --background-light: #f5f5f5;
        --background-white: #ffffff;
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
          max-width: 600px;
          box-sizing: border-box;
        }

        .login-header {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 15px;
          margin-bottom: 35px;
          text-align: center;
        }

        .logo-container {
          color: var(--accenture-purple);
          justify-self: start; /* Aligns the logo to the left */
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
          grid-column: 1 / span 2; /* Makes the title span both columns to center it */
          justify-self: center; /* Ensures it's centered within the spanned columns */
          padding-left: 45px; /* Offset to perfectly center, accounts for logo width */
          box-sizing: border-box;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          color: var(--text-light);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-sizing: border-box;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .form-input:focus, .form-select:focus {
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
      `}</style>

            <div className="login-page-container">
                <div className="login-container">
                    <div className="login-header">
                        {/* <div className="logo-container">
                            <AccentureLogo />
                        </div> */}
                        <h1>IX Engineering</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="enterpriseId">Enterprise Mail ID</label>
                            <input
                                type="text"
                                id="enterpriseId"
                                className="form-input"
                                value={enterpriseId}
                                onChange={(e) => setEnterpriseId(e.target.value)}
                                placeholder="e.g., s.bw.gunasekaran@accenture.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                className="form-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-btn">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;