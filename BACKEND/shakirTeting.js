module.exports = function (app) {
   

    const db = require('./App/Models');
  
    const services = db.services;
    const categorie = db.categorie;
     
   

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


//   async function fetchData() {
//     try {
//       // Your Mongoose query without the callback
//       const result = await services.find().exec();
  
//       console.log('Data fetched:', result);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//     }
//   }
  
//   fetchData();

services.find()
.populate('category', 'segment')
.then(product=>console.log(product))
.catch(error=>console.log(error));
      
      
      
      
      
      



        
        // services.create({
        //     name: 'IDEA#',
        //     instrument_token:"14366",
        //     zebu_token:"IDEA-EQ",
        //     kotak_token:"125",
        //     categorie_id : '64c9dbdc14a9fefd971c9797'
        //   })
        //   .then((createdServices) => {
        //     console.log('User created and saved:', createdServices._id)
        //   })
        //   .catch((err) => {
        //     console.error('Error creating and saving user:', err);
        //   });





        res.send({ msg: "shakir Done!!!" })
      });

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