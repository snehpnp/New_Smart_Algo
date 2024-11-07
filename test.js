// const numbers = [1, 2, 2, 3, 4, 4, 5];
// const uniqueNumbers = numbers.filter((num, index, arr) => arr.indexOf(num) === index);
// console.log(uniqueNumbers); // Output: [1, 2, 3, 4, 5]

// console.log(new Set(numbers)); // Output: Set { 1, 2, 3, 4, 5 }

// const uniqueNumbersUsingSet = Array.from(new Set(numbers));
// console.log(uniqueNumbersUsingSet); // Output: [1, 2, 3, 4, 5]

// // OR
// const uniqueNumbersUsingSet1 = [...new Set(numbers)];
// console.log(uniqueNumbersUsingSet1); // Output: [1, 2, 3, 4, 5]


// const people = [
//     { name: 'Alice', age: 25, city: 'New York' },
//     { name: 'Bob', age: 17, city: 'Los Angeles' },
//     { name: 'Charlie', age: 19, city: 'New York' },
//     { name: 'Dave', age: 20, city: 'Chicago' },
//     { name: 'Eve', age: 23, city: 'New York' }
//   ];
// console.log(Object.values(people.map(person=>person.age > 18)).sort());


// function closestToNegativeTwo(arr) {
//     let closestNumber = arr[0]; // Starting with the first element as the closest
  
//     // Iterate through the array to find the closest number to -2
//     for (let i = 1; i < arr.length; i++) {
//       // Compare the distances to -2 for each number in the array
//       if (Math.abs(arr[i] - (-2)) < Math.abs(closestNumber - (-2))) {
//         closestNumber = arr[i];
//       }
//     }
  
//     return closestNumber;
//   }
  
//   // Testing the function
//   const numbers = [-5, -3, -1, 0, 1, 2];
//   const closest = closestToNegativeTwo(numbers);
  
//   console.log(`The number closest to -2 is: ${closest}`);
  

function closestToNegativeTwo(arr) {
    let closestDistance = Math.abs(arr[0] - (-2));
    console.log(closestDistance); 
    let closestNumbers = [arr[0]]; 
  

    for (let i = 1; i < arr.length; i++) {
      const distance = Math.abs(arr[i] - (-2));
      console.log(distance);
  
      if (distance === closestDistance) {
        closestNumbers.push(arr[i]);
      }
    
      else if (distance < closestDistance) {
        closestDistance = distance;
        closestNumbers = [arr[i]];
      }
    }
  
    return closestNumbers;
  }
  
  // Testing the function
  const numbers = [-5,  -0.9, 0, 1, 2,-3.1,];
  const closest = closestToNegativeTwo(numbers);
  
  console.log(`The numbers closest to -2 are: ${closest}`);
  