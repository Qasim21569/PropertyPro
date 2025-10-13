import React from "react";
import "./LoginModal.css";

const LoginModal = ({ opened, setOpened, onLogin, onDemoAccess }) => {
  if (!opened) return null;

  return (
    <div className="login-modal-overlay" onClick={() => setOpened(false)}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <h2>Welcome to PropertyPro</h2>
          <button 
            className="close-button" 
            onClick={() => setOpened(false)}
          >
            ×
          </button>
        </div>
        
        <div className="login-modal-body">
          <p>Please login to access all features of PropertyPro</p>
          
          <button 
            className="login-button primary"
            onClick={onLogin}
          >
            Login with Auth0
          </button>
          
          <div className="login-divider">
            <span>or</span>
          </div>
          
          <button 
            className="guest-button"
            onClick={() => setOpened(false)}
          >
            Continue as Guest
          </button>
          
          {/* Subtle developer access button */}
          <div 
            className="dev-access"
            onClick={onDemoAccess}
            title="Developer Access"
          >
            •
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
