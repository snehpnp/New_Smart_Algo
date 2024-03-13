// Your date of birth
var dob = new Date('1992-02-17');

// Current date
var today = new Date();

// Calculate the difference in milliseconds
var ageInMillis = today - dob;

// Convert milliseconds to years, months, and days
var ageInYears = Math.floor(ageInMillis / (365.25 * 24 * 60 * 60 * 1000));
var ageInMonths = Math.floor((ageInMillis % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
var ageInDays = Math.floor((ageInMillis % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));

// Output the result
console.log("Your age is " + ageInYears + " years, " + ageInMonths + " months, and " + ageInDays + " days.");
