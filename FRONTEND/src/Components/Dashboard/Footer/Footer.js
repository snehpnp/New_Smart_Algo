import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const domainName = localStorage.getItem("panel_name");

  const companyName = domainName; // Your company name
  const footerStyle = {
    color: "black",
    padding: "15px 0",
    fontSize: "14px",
    backgroundColor: "#f1f1f1", // Optional background color for the footer
  };

  const footerTextStyle = {
    margin: 0,
    padding: "5px 10px",
  };

  const footerLinkStyle = {
    color: "rgb(65, 117, 5)",
    // fontWeight: "bold",
    textDecoration: "none",
  };

  const footerLinkHoverStyle = {
    textDecoration: "underline",
    color: "red", // Light red on hover
  };

  return (
    <footer style={footerStyle} className="row">
      {/* Left corner section */}
      <div
        className="col-md-6"
        style={{
          display: "flex",
          justifyContent: "flex-start", // Align to the left
          alignItems: "center",
        }}
      >
        <p style={footerTextStyle}>
          Copyright © {currentYear}{" "}
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
          . All Rights Reserved.
        </p>
      </div>

      {/* Right corner section */}
      <div
        className="col-md-6"
        style={{
          display: "flex",
          justifyContent: "flex-end", // Align to the right
          alignItems: "center",
        }}
      >
        @
        <a
          rel="noopener noreferrer"
          style={footerLinkStyle}
          onMouseOver={(e) =>
            (e.target.style.color = footerLinkHoverStyle.color)
          }
          onMouseOut={(e) => (e.target.style.color = footerLinkStyle.color)}
        >
          {companyName}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
