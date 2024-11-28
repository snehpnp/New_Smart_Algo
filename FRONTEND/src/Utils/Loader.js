import React from "react";

const Loader = ({ fullPage = false }) => {
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: fullPage ? "100vh" : "30vh",
    backgroundColor: fullPage ? "rgba(0, 0, 0, 0.1)" : "transparent",
    position: fullPage ? "fixed" : "relative",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 9999,
  };

  return (
    <>
      <style>
        {`
          .loader {
            border: 6px solid #f3f3f3; /* Light gray */
            border-top: 6px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          }
          ${keyframes}
        `}
      </style>
      <div style={containerStyle}>
        <div className="loader"></div>
      </div>
    </>
  );
};

export default Loader;
