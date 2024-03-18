// Define your string
const str = "7";

// Regular expression pattern to match "All" or any number
const pattern = /^(All|\d+)$/;

// Test if the string matches the pattern
const isMatch = pattern.test(str);

console.log(isMatch); // Output will be true if the string contains only "All" or any number, false otherwise
