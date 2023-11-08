// Input JSON object
const jsonObject = {
    "name": "John",
    "age": 30,
    "city": "New York"
  };
  
  // Swapping key-value pairs
  const swappedObject = {};
  for (const key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      swappedObject[jsonObject[key]] = key;
    }
  }
  


  console.log(swappedObject);
  