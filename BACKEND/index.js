const fs = require('fs');
// const mysql = require('mysql2/promise');

const imageBuffer = readFileAsBase64('C:/Users/Punit/Downloads/download.jfif');

function readFileAsBase64(filePath) {
    const fileData = fs.readFileSync(filePath);
    return fileData.toString('base64');
  }

async function main() {
  try {
    console.log("imageBuffer",imageBuffer);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
