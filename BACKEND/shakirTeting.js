module.exports = function (app) {
    
  const WebSocket = require('ws');
  var CryptoJS = require("crypto-js");

    const db = require('./App/Models');
  
    const services = db.services;
    const categorie = db.categorie;

    const { MongoClient } = require('mongodb');

    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    client.connect();
    console.log("Connected to MongoDB successfully!");
     
   

 app.get('/shakirTest', async (req, res) => {

  const pipeline = [

    {
      $lookup: {
        from: 'categories',
        localField: 'categorie_id',
        foreignField: '_id',
        as: 'categoryResult'
      }
    },
    {
      $match: {
        'categoryResult.segment': "C",
      }
    },
    {
      $unwind: '$categoryResult', // Unwind the 'categoryResult' array
    },
    // {
    //   $project: {
    //     // Include fields from the original collection
    //    //  'categoryResult.segment': 1,
        
    //     // Include fields from the 'categoryResult' array
    //     // 'categoryResult.fieldName1': 1,
    //     // 'categoryResult.fieldName2': 1,
        
    //     // // Exclude the rest of the 'categoryResult' fields if needed
    //     // 'categoryResult._id': 0,
    //     // 'categoryResult.fieldName3': 0,
        
    //     // Include other fields as needed
    //   },


    // },
  ];

  const result = await services.aggregate(pipeline);
  res.send({status:true,data:result});
  return
  
//  services.find({})
//   .populate('category', 'name') // Populate the 'user' field with 'name' and 'email' fields from the User collection
//   .exec((err, servicesdata) => {
//     if (err) {
//       console.error('Error fetching posts:', err);
//     } else {
//       console.log('Posts with user data:', servicesdata);
//     }
//   });


      });





      async function connectToDB(collectionName,response) {
        try {
          
          const db = client.db('TradeTools'); // Replace 'mydb' with your desired database name
         // console.log("db",db);
        //  const collectionName = 'shakir'; // Replace with your desired collection name

         // List all collections in the database
    const collections = await db.listCollections().toArray();
    
    // Check if the desired collection exists
    const collectionExists = collections.some(coll => coll.name === collectionName);

    if (collectionExists) {
      //console.log(`Collection '${collectionName}' exists.`);

      const collection = db.collection(collectionName);
      
      if(response.lp != undefined){
        let bp1 = response.lp;
        let sp1 = response.lp;
        let v = '';
        
        if(response.bp1 != undefined){
           bp1 = response.bp1
        }

        if(response.sp1 != undefined){
           sp1 = response.sp1
        }

        if(response.v != undefined){
          v = response.v
        }


      let singleDocument = {
           t: response.tk,
           lp: response.lp,
           bp1: bp1,
           sp1: sp1,
           v: v
       }

       
      const insertResult = await collection.insertOne(singleDocument);
     // console.log('Inserted document:', insertResult.insertedId);


       } 


    // Update a single document
    // const filter = { name: 'Jane' };
    // const update = { $set: { age: 30 } }; // Update the 'age' field to 30
    // const updateResult = await collection.updateOne(filter, update);
    // console.log('Matched documents:', updateResult.matchedCount);
    // console.log('Modified documents:', updateResult.modifiedCount);




    } else {
       // console.log(`Collection '${collectionName}' does not exist.`);
        await db.createCollection(collectionName);
       // console.log(`Collection '${collectionName}' created successfully`);
      
        const collection = db.collection(collectionName);
       // const singleDocument = { name: 'John', age: 30 };

        if(response.lp != undefined){
          let bp1 = response.lp;
          let sp1 = response.lp;
          let v = '';
          
          if(response.bp1 != undefined){
             bp1 = response.bp1
          }

          if(response.sp1 != undefined){
             sp1 = response.sp1
          }

          if(response.v != undefined){
            v = response.v
          }


        let singleDocument = {
             t: response.tk,
             lp: response.lp,
             bp1: bp1,
             sp1: sp1,
             v: v
         }

         
        const insertResult = await collection.insertOne(singleDocument);
        //console.log('Inserted document:', insertResult.insertedId);


         }  



        



  

    }
 



          // await db.createCollection(collectionName);
          // console.log(`Collection '${collectionName}' created successfully`);



          // Now you can create a collection, insert documents, or perform other operations
      
        } catch (err) {
          console.error('Error connecting to MongoDB:', err);
        } 
      }     



app.get('/socket-api', async (req, res) => {
const collection = "shakir2";
//connectToDB(collection);

  var BASEURL = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/";
  let AuthorizationToken;
  let type = "API";
  const url = "wss://ws1.aliceblueonline.com/NorenWS/";
  let socket;
  let channel = 'NSE|3045#NSE|14366#NFO|61546#NFO|61547#NFO|61548#NFO|61549';
  let userId = '438760';
  let userSession = 'g1FI0oO5fuYK3uKxcBqyIlX3HOdIjtY6T2kNjo11PEDy3UTYgATLbVBSztdb7FOdO3796WB8qqQJ35bbTmQB6zPMg5A9jgSZBvNerrGgG8aBrhZpmrWcWMNKBaOAfvWcZlofnkY5n7VGa7VvHSMdv70vhTshmqz3mQWyXWFMiH7Mdq7jQNhNJJOXpsSHoiNkxZp6IEuYh6Onn4DCYmjHH1czbMZKH8nKLS1lnab1BTEfh7a0hNyN0MNnQkAdUu0D';


   connect(userId,userSession,channel)

   function connect(userId, userSession, token = "") {

        socket = new WebSocket(url);
        socket.onopen = function () {
            connectionRequest(userId, userSession);
            
        };
        socket.onmessage = async function (msg) {
            var response = JSON.parse(msg.data);
        //    console.log("okk socket open  1 ",response)
            
            if(response.tk){ 
             //console.log("response",response)
              connectToDB(response.tk,response);  
           }
          
           

            if (response.s == "OK") {

                var channel = token;
                let json = {
                    k: channel,
                    t: 't'
                };
                socket.send(JSON.stringify(json))

            }

        };
    }

    function connectionRequest(userId, userSession) {
        var encrcptToken = CryptoJS.SHA256(
            CryptoJS.SHA256(userSession).toString()
        ).toString();
        // alert(encrcptToken);
        var initCon = {
            susertoken: encrcptToken,
            t: "c",
            actid: userId + "_" + type,
            uid: userId + "_" + type,
            source: type,
        };
        // console.log('initCon', JSON.stringify(initCon));
        try {
            socket.send(JSON.stringify(initCon));
        } catch (error) {
            console.log("Shocket",error);
        }
       
    }
 res.send("socket run")
});




//Add stoch Api.....
 app.get('/addstock',async function(req,res){
          
  
  const pipeline = [

    {
      $project: {
        // Include fields from the original collection
         'segment': 1, 
      },
    },
  ];

  const categoryResult = await categorie.aggregate(pipeline);
  //const matchingElements = categoryResult.filter(item => item.segment === "FO");

  // console.log('Matching elements:', matchingElements[0]._id);
  res.send("done");
    return
     var axios = require('axios');
    var config = {
        method: 'get',
        url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
    };

    axios(config)
        .then(function (response) { 

          // res.send(response.data);
          // console.log(response.data);

          
          
          // Using a loop to extract 'name' and 'instrumenttype'
         
             
          var unique_key = []
          let count = 0
          response.data.forEach((item) => {

          //   function findRepeatedElements(array) {
          //     const frequencyMap = {};
          //     const repeatedElements = [];
            
          //     array.forEach(element => {
          //       if (frequencyMap[element.instrumenttype]) {
          //         frequencyMap[element.instrumenttype]++;
          //         if (frequencyMap[element.instrumenttype] === 2) {
          //           repeatedElements.push(element.instrumenttype);
          //         }
          //       } else {
          //         frequencyMap[element.instrumenttype] = 1;
          //       }
          //     });
            
          //     return repeatedElements;
          //   }
            
          //   const inputArray = response.data;
          //   const repeatedElements = findRepeatedElements(inputArray);
            
          //   console.log('Repeated elements:', repeatedElements);
          //   res.send(repeatedElements)
          // return


          //  if(item.instrumenttype == 'FUTSTK' || item.instrumenttype == 'FUTIDX' || item.instrumenttype == 'FUTCUR'||item.instrumenttype == 'FUTCOM'||item.instrumenttype == 'OPTSTK'||item.instrumenttype == 'OPTIDX'||item.instrumenttype == 'OPTCUR'||item.instrumenttype == 'OPTFUT'){ 
           

           
           if(!unique_key.includes(`${item.name}-${item.instrumenttype}`)){
            unique_key.push(`${item.name}-${item.instrumenttype}`);


            if (item.symbol.slice(-3) == '-EQ') {
              count++
              console.log('item - C '+count+' ',item)
              const matchingElements = categoryResult.filter(item => item.segment === "C");
              const category_id = matchingElements[0]._id
             
            
            services.create({
            name:item.name +'#',
            instrument_token:item.token,
            zebu_token:item.symbol,
            kotak_token:"",
            instrumenttype:item.instrumenttype,
            exch_seg:item.exch_seg,
            lotsize:item.lotsize,
            categorie_id : category_id,
            unique_column : item.name +'#_'+category_id
          })
          .then((createdServices) => {
            console.log('User created and saved:', createdServices._id)
          })
          .catch((err) => {
            try{
            console.error('Error creating and saving user:', err);
            }catch(e){
             console.log("duplicate key")
            }

          });


          }
              

      

             if(item.instrumenttype == 'FUTSTK' || item.instrumenttype == 'FUTIDX'){
              count++
              console.log('item - F '+count+' ',item)
              const matchingElements = categoryResult.filter(item => item.segment === "F");
              const category_id = matchingElements[0]._id

                

              services.create({
                name:item.name,
                instrument_token:item.token,
                zebu_token:item.symbol,
                kotak_token:"",
                instrumenttype:item.instrumenttype,
                exch_seg:item.exch_seg,
                lotsize:item.lotsize,
                categorie_id : category_id,
                unique_column : item.name +'_'+category_id
              })
              .then((createdServices) => {
                console.log('User created and saved:', createdServices._id)
              })
              .catch((err) => {
                try{
                console.error('Error creating and saving user:', err);
                }catch(e){
                 console.log("duplicate key")
                }
    
              });




              }

              

              if(item.instrumenttype == 'OPTSTK' || item.instrumenttype == 'OPTIDX'){
                count++
                console.log('item - O '+count+' ',item)
                const matchingElements = categoryResult.filter(item => item.segment === "O");
                const category_id = matchingElements[0]._id

                services.create({
                  name:item.name,
                  instrument_token:item.token,
                  zebu_token:item.symbol,
                  kotak_token:"",
                  instrumenttype:item.instrumenttype,
                  exch_seg:item.exch_seg,
                  lotsize:item.lotsize,
                  categorie_id : category_id,
                  unique_column : item.name +'_'+category_id
                })
                .then((createdServices) => {
                  console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try{
                  console.error('Error creating and saving user:', err);
                  }catch(e){
                   console.log("duplicate key")
                  }
      
                });




                }


                if(item.instrumenttype == 'OPTFUT'){
                  count++
                  console.log('item - MO '+count+' ',item)
                  const matchingElements = categoryResult.filter(item => item.segment === "MO");
                  const category_id = matchingElements[0]._id

                  services.create({
                    name:item.name,
                    instrument_token:item.token,
                    zebu_token:item.symbol,
                    kotak_token:"",
                    instrumenttype:item.instrumenttype,
                    exch_seg:item.exch_seg,
                    lotsize:item.lotsize,
                    categorie_id : category_id,
                    unique_column : item.name +'_'+category_id
                  })
                  .then((createdServices) => {
                    console.log('User created and saved:', createdServices._id)
                  })
                  .catch((err) => {
                    try{
                    console.error('Error creating and saving user:', err);
                    }catch(e){
                     console.log("duplicate key")
                    }
        
                  });
             



                  }


                  if(item.instrumenttype == 'FUTCOM'){
                    count++
                    console.log('item - MF '+count+' ',item)
                    const matchingElements = categoryResult.filter(item => item.segment === "MF");
                    const category_id = matchingElements[0]._id

                    services.create({
                      name:item.name,
                      instrument_token:item.token,
                      zebu_token:item.symbol,
                      kotak_token:"",
                      instrumenttype:item.instrumenttype,
                      exch_seg:item.exch_seg,
                      lotsize:item.lotsize,
                      categorie_id : category_id,
                      unique_column : item.name +'_'+category_id
                    })
                    .then((createdServices) => {
                      console.log('User created and saved:', createdServices._id)
                    })
                    .catch((err) => {
                      try{
                      console.error('Error creating and saving user:', err);
                      }catch(e){
                       console.log("duplicate key")
                      }
          
                    });



                    }

                    if(item.instrumenttype == 'FUTCUR'){
                      count++
                      console.log('item - CF '+count+' ',item)
                      const matchingElements = categoryResult.filter(item => item.segment === "CF");
                      const category_id = matchingElements[0]._id


                      services.create({
                        name:item.name,
                        instrument_token:item.token,
                        zebu_token:item.symbol,
                        kotak_token:"",
                        instrumenttype:item.instrumenttype,
                        exch_seg:item.exch_seg,
                        lotsize:item.lotsize,
                        categorie_id : category_id,
                        unique_column : item.name +'_'+category_id
                      })
                      .then((createdServices) => {
                        console.log('User created and saved:', createdServices._id)
                      })
                      .catch((err) => {
                        try{
                        console.error('Error creating and saving user:', err);
                        }catch(e){
                         console.log("duplicate key")
                        }
            
                      });


                      }

                  // if(item.instrumenttype == 'AMXIDX'|| item.instrumenttype == 'OPTIRC' || item.instrumenttype == 'UNDIRC' || item.instrumenttype == 'FUTIRC' || item.instrumenttype == 'UNDCUR' || item.instrumenttype == 'INDEX' || item.instrumenttype == 'COMDTY' || item.instrumenttype == 'AUCSO'){
                  //       count++
                  //       console.log('item - OTHER CONTENT '+count+' ',item)
                  //       // const matchingElements = categoryResult.filter(item => item.segment === "C");
                  //       // const category_id = matchingElements[0]._id
                  //       services.create({
                  //         name:item.name,
                  //         instrument_token:item.token,
                  //         zebu_token:item.symbol,
                  //         kotak_token:"",
                  //         instrumenttype:item.instrumenttype,
                  //         exch_seg:item.exch_seg,
                  //         lotsize:item.lotsize,
                  //         categorie_id : "",
                  //         unique_column : item.name +'_'+'c9dbdc14a9fefd971c979'
                  //       })
                  //       .then((createdServices) => {
                  //         console.log('User created and saved:', createdServices._id)
                  //       })
                  //       .catch((err) => {
                  //         try{
                  //         console.error('Error creating and saving user:', err);
                  //         }catch(e){
                  //          console.log("duplicate key")
                  //         }
              
                  //       });


                  //       }
       
            }
       //   }
      
          });
      

         return
   
           function findRepeatedElements(array) {
            const frequencyMap = {};
            const repeatedElements = [];
          
            array.forEach(element => {
              if (frequencyMap[element.instrumenttype]) {
                frequencyMap[element.instrumenttype]++;
                if (frequencyMap[element.instrumenttype] === 2) {
                  repeatedElements.push(element.instrumenttype);
                }
              } else {
                frequencyMap[element.instrumenttype] = 1;
              }
            });
          
            return repeatedElements;
          }
          
          const inputArray = response.data;
          const repeatedElements = findRepeatedElements(inputArray);
          
          console.log('Repeated elements:', repeatedElements);
          
    
          
        });
      
}); 


 };