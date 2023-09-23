const data = {
    "64d7761bc9af6c1843e4641a": {ordertype :"3", producttype :"4",  qty : "122"},
    "64d7761bc9af6c1843e464b6": {ordertype :"3",  qty : "122", trading : false},
    "64d7761bc9af6c1843e46470": {ordertype :"3", producttype :"4",   trading : false},
    "64d7761bc9af6c1843e464ad": {ordertype :"3", producttype :"4",  qty : "122",},
    "64d77617c9af6c1843e461ec": { producttype :"4",  qty : "122", trading : false}
  };
  
  const lgaToMatch = "64d7761bc9af6c1843e464ad"; // Lga ID jise match karna hai
  
  if (data[lgaToMatch]) {
    const matchedObject = data[lgaToMatch];
    console.log("Matching Object:", matchedObject);
  } else {
    console.log("No match found for Lga ID:", lgaToMatch);
  }
  