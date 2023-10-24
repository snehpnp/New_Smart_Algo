// const dates = [
//     '02112023',
//     '09112023',
//     '16112023',
//     '23112023',
//     '24062027',
//     '24122025',
//     '25062026',
//     '26062025',
//     '26092024',
//     '26102023',
//     '26122024',
//     '27062024',
//     '28032024',
//     '28122023',
//     '29062028',
//     '30112023',
//     '30122027',
//     '31122026'
//   ];

//   // Convert string dates to Date objects
//   const dateObjects = dates.map(dateString => new Date(`${dateString.slice(4, 8)}-${dateString.slice(2, 4)}-${dateString.slice(0, 2)}`));

//   // Sort Date objects
//   dateObjects.sort((a, b) => a - b);

//   // Convert sorted Date objects back to string dates
//   const sortedDates = dateObjects.map(dateObject => {
//     const year = dateObject.getFullYear();
//     const month = String(dateObject.getMonth() + 1).padStart(2, '0');
//     const day = String(dateObject.getDate()).padStart(2, '0');
//     return `${day}${month}${year}`;
//   });

//   console.log(sortedDates.slice(0, 6));
// var a = 10;
// var B = 20;

// [a, B] = [B, a];

// console.log("a: " + a); // Output will be 20
// console.log("B: " + B); // Output will be 10


db.alice_tokens.aggregate([
    {
        $match: { symbol: "NIFTY" }
    },
    {
        $group: {
            _id: "$symbol",
            uniqueExpiryValues: { $addToSet: "$expiry" }
        }
    },
    {
        $unwind: "$uniqueExpiryValues" // (Optional: If the uniqueExpiryValues is an array)
    },
    {
        $addFields: {
            expiryDate: {
                $dateFromString: {
                    dateString: "$uniqueExpiryValues",
                    format: "%d%m%Y"
                }
            }
        }
    },
    {
        $sort: { expiryDate: 1 } // Sort ascending
    },
    {
        $limit: 6 // Limit to the first 6 values
    }
])






















