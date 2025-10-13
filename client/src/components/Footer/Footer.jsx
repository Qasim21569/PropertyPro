import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        {/* left side */}
        <div className="flexColStart f-left">
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '28px', fontWeight: 'bold', color: '#1f3e72', marginBottom: '1rem' }}>
            🏠 PropertyPro
          </div>
          <span className="secondaryText">
            Your trusted partner for premium <br />
            real estate solutions in Mumbai.
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">Contact Information</span>
          <span className="secondaryText">Office 301, Andheri West, Mumbai 400058, Maharashtra, India</span>
          <span className="secondaryText">Phone: +91 98765 43210 | Email: contact@propertypro.com</span>
          <div className="flexCenter f-menu">
            <span>Properties</span>
            <span>Services</span>
            <span>Investment</span>
            <span>About Us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
