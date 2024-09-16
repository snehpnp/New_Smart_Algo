import React, { useEffect, useState } from "react";

const newsData = [
  "Algorithmic trading carries inherent risks, including market volatility and fluctuations.Trading in financial markets can result in the loss of capital   Ensure that you fully understand the risks associated with trading before engaging   You are solely responsible for all decisions and outcomes resulting from the use of this software.",
];

const NewsTicker = () => {


  return (
    <marquee className="mb-2" style={{fontSize:"1.3rem"}}><b >{newsData}</b></marquee>
  );
};

export default NewsTicker;
