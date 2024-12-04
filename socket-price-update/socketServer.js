const {Alice_Socket} = require("./Alicesocket");


const socketRestart = async () => {
    let retryCount = 0;
    let maxRetries = 5;
    let delay = 1000; // Initial delay in ms
  
    const attemptReconnect = async () => {
      if (retryCount < maxRetries) {
        console.log(`Reconnect attempt ${retryCount + 1}`);
        await Alice_Socket(); // Call your function to reconnect
  
        retryCount++;
        delay *= 2; // Exponential backoff
  
        setTimeout(attemptReconnect, delay); // Retry after delay
      } else {
        console.log('Max retries reached. Giving up on reconnecting.');
      }
    };
  
    attemptReconnect();
  };
  