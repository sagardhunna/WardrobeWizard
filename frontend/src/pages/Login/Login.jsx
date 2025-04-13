import React from 'react';
import LoginPopover from "../../components/LoginPopover/LoginPopover";
import "./login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome to Wardrobe Wizard</h1>
        <p className="login-subtext">Please log in with your Google account to continue</p>
        <LoginPopover />
      </div>
    </div>
  );
}

export default Login;