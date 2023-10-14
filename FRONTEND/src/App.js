import Main_Router from './Routes/Route'
import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';

const App = () => {
  const pageRef = useRef(null);

  const captureScreenshot = () => {

    // const options = {
    //   width: document.documentElement.scrollWidth, // Set custom width
    //   height: document.documentElement.scrollHeight, // Set custom height
    // };

    // // Set the window size and scroll position to match the content size
    // // window.resizeTo(width, height);
    // window.scrollTo(0, 0);

    // // Capture the screenshot
    // html2canvas(pageRef.current, options).then(canvas => {
    //   // Convert canvas to an image and download it
    //   const screenshot = canvas.toDataURL('image/png');
    //   const link = document.createElement('a');
    //   link.href = screenshot;
    //   link.download = 'screenshot.png';
    //   link.click();
    // })
  };



  return (
    <div >
      {/* <div ref={pageRef} > */}
        <Main_Router />
      {/* </div> */}
      {/* <button className='d-flex mx-auto' style={{ marginTop: '70px' }} onClick={captureScreenshot}>123Capture Screenshot</button> */}

    </div>
  )
}

export default App





