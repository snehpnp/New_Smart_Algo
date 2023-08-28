
function getCurrentDateTime() {
    const currentDate = new Date();
  
    const year = currentDate.getFullYear();
    const month = addLeadingZero(currentDate.getMonth() + 1); // Months are 0-indexed, so add 1 to get the actual month number (1-12)
    const day = addLeadingZero(currentDate.getDate());
    const hours = addLeadingZero(currentDate.getHours());
    const minutes = addLeadingZero(currentDate.getMinutes());
    const seconds = addLeadingZero(currentDate.getSeconds());
  
    return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
  }
  
  function addLeadingZero(number) {
    return number < 10 ? `0${number}` : number;
  }
  
  const formattedDateTime = getCurrentDateTime();


  module.exports = {formattedDateTime}