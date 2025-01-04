import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const domainName = localStorage.getItem("panel_name");

  const companyName = domainName;
  const footerStyle = {
    color: "black",
    padding: "15px 0",
    fontSize: "14px",
    backgroundColor: "#f1f1f1",
  };

  const footerTextStyle = {
    margin: 0,
    padding: "5px 10px",
  };

  const footerLinkStyle = {
    color: "red",
    textDecoration: "none",
  };

  const footerLinkHoverStyle = {
    textDecoration: "underline",
    color: "red",
  };

  return (
    <footer style={footerStyle} className="row">
      <div
        className="col-md-6"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <p style={footerTextStyle}>
          Copyright © {previousYear + "-" + currentYear}{" "}
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
          . All Rights Reserved.
        </p>
      </div>

      <div
        className="col-md-6"
        style={{
          display: "flex",
          justifyContent: "flex-end",
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
