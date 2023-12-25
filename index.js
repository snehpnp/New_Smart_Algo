// function drawHeart() {
//     for (let row = 0; row < 6; row++) {
//       let rowOutput = '';
//       for (let col = 0; col < 7; col++) {
//         if ((row === 0 && col % 3 !== 0) || (row === 1 && col % 3 === 0) ||
//             (row - col === 2) || (row + col === 8)) {
//           rowOutput += '*';
//         } else {
//           rowOutput += ' ';
//         }
//       }
//       console.log(rowOutput);
//     }
//   }

// //   drawHeart();
//       console.log(" s s s ");
//       console.log("s      s");
//       console.log("  s ")
//       console.log("    s");
//       console.log("s    s ");
//       console.log(" s s s");


// Outer loop for rows
for (let i = 1; i <= 8; i++) {
  let rowOutput = '';
  for (let j = 1; j <= 10; j++) {
    if (
      (i == 1 && j == 2 || j == 4 || j == 6) ||
      (i == 2 && j == 1) ||
      (i == 3 && j == 2) ||
      (i == 4 && j == 3) ||
      (i == 5 && j == 4) ||
      (i == 6 && j == 6) ||
      (i == 7 && j == 7)
    ) {

      rowOutput += "s"
    } else {
      rowOutput += " "

    }
  }
  rowOutput = ""
  console.log(rowOutput);
}

