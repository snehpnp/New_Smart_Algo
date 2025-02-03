import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get current year dynamically
  const domainName = window.location.hostname; // This will give the domain name (e.g., "example.com")

  const companyName = domainName; // Your company name
  const footerStyle = {
    color: "black",
    textAlign: "center",
    padding: "15px 0",
    fontSize: "14px",
  };

  const footerTextStyle = {
    margin: 0,
    padding: "5px 10px",
  };

  const footerLinkStyle = {
    color: "black",
    fontWeight: "bold",
    textDecoration: "none",
  };

  const footerLinkHoverStyle = {
    textDecoration: "underline",
    color: "red", // Light red on hover
  };

  return (
    <footer style={footerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={footerTextStyle}>
          Copyright © {currentYear} Designed &amp; Developed by{" "}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            style={footerLinkStyle}
            onMouseOver={(e) =>
              (e.target.style.color = footerLinkHoverStyle.color)
            }
            onMouseOut={(e) => (e.target.style.color = footerLinkStyle.color)}
          >
            {companyName}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
