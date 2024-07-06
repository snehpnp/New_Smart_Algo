import React from 'react';


const Loader = ({ fullPage = false }) => {
  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className={fullPage ? 'full-page-loader-overlay' : 'card-loader-overlay'}>
          <div className="loader">Loading...</div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
