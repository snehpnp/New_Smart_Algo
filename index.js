// // Create a new Date object
// var currentDate = new Date();

// // Get various components of the current date and time
// var year = currentDate.getFullYear();
// var month = currentDate.getMonth(); // Months are zero-based (0 - 11)
// var day = currentDate.getDate();
// var hours = currentDate.getHours();
// var minutes = currentDate.getMinutes();
// var seconds = currentDate.getSeconds();

// // Format the components as needed
// var formattedDate = year + "-" + (month + 1) + "-" + day;
// var formattedTime = hours + ":" + minutes + ":" + seconds;

// console.log("Current Time:",formattedDate+ " "+ formattedTime);

// console.log(new Date());


// var currentDate = new Date();
// var dateFormatter = new Intl.DateTimeFormat("en-US");
// var timeFormatter = new Intl.DateTimeFormat("en-US", { timeStyle: "medium" });

// console.log("Current Time:",dateFormatter.format(currentDate)+" " + timeFormatter.format(currentDate));



var timestamp = Date.now();
var currentDate = new Date(timestamp);
const CurrentDatetime = currentDate.toLocaleDateString() +" "+ currentDate.toLocaleTimeString()
console.log("Current Time:",CurrentDatetime);