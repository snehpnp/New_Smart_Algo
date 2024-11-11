const dataToUpdate = [


    {
        "_id": {
          "$oid": "64c9dbdc14a9fefd971c9797"
        },
        "category_id": "1",
        "name": "CASH",
        "segment": "C",
        "status": 0,
        "CID": "1",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.723Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "64c9dbdc14a9fefd971c9799"
        },
        "category_id": "3",
        "name": "OPTION",
        "segment": "O",
        "status": 0,
        "CID": "3",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.741Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "64c9dbdc14a9fefd971c9798"
        },
        "category_id": "2",
        "name": "FUTURE",
        "segment": "F",
        "status": 0,
        "CID": "2",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.737Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "64c9dbdc14a9fefd971c979a"
        },
        "category_id": "4",
        "name": "MCX FUTURE",
        "segment": "MF",
        "status": 0,
        "CID": "4",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.744Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "64c9dbdc14a9fefd971c979b"
        },
        "category_id": "5",
        "name": "MCX OPTION",
        "segment": "MO",
        "status": 0,
        "CID": "5",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.750Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "64c9dbdc14a9fefd971c979c"
        },
        "category_id": "6",
        "name": "CURRENCY OPTION",
        "segment": "CO",
        "status": 0,
        "CID": "6",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.753Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "64c9dbdc14a9fefd971c979d"
        },
        "category_id": "7",
        "name": "CURRENCY FUTURE",
        "segment": "CF",
        "status": 0,
        "CID": "7",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.756Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "64c9dbdc14a9fefd971c979e"
        },
        "category_id": "8",
        "name": "FUTURE OPTION",
        "segment": "FO",
        "status": 0,
        "CID": "3",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.760Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "66d2c6e5c6e24c59b81a1e13"
        },
        "category_id": "9",
        "name": "BSE CASH",
        "segment": "BC",
        "status": 0,
        "CID": "9",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.760Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "66d2c710c6e24c59b81a1e14"
        },
        "category_id": "10",
        "name": "BSE FUTURE",
        "segment": "BF",
        "status": 0,
        "CID": "10",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.760Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "66d2c72ec6e24c59b81a1e15"
        },
        "category_id": "11",
        "name": "BSE OPTION",
        "segment": "BO",
        "status": 0,
        "CID": "11",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.760Z"
        },
        "__v": 0
      },
      {
        "_id": {
          "$oid": "66d2c74cc6e24c59b81a1e16"
        },
        "category_id": "12",
        "name": "BSE FUTURE OPTION",
        "segment": "BFO",
        "status": 0,
        "CID": "11",
        "createdAt": {
          "$date": "2023-08-02T04:30:20.760Z"
        },
        "__v": 0
      }

];

const { MongoClient } = require('mongodb');

const databaseUrls = [
    'mongodb://reliablealgo:sA8k%26n86%267Mv%26fh57B%26@185.209.75.14:27017/',
  'mongodb://codingpandit:zsg%26k5sB76%263H%26dk7A%26@185.209.75.31:27017/',
  'mongodb://ccconnect:Apw%26k5R6%267GsRy%26vnM@185.209.75.66:27017/',
  'mongodb://danoneitsolution:p%26k5H6%267GsRy%26vnd%26@217.145.69.76:27017/',
  'mongodb://corebizinfotech:c%26eaV8N%267KfT%26bc49A%26@185.209.75.10:27017/',
  'mongodb://codingpandit:zsg%26k5sB76%263H%26dk7A%26@185.209.75.31:27017/',
  'mongodb://adonomist:p%26k5H6%267GsRy%26vnd%26@193.239.237.93:27017/',
  'mongodb://adonomist:p%26k5H6%267GsRy%26vnd%26@193.239.237.178:27017/',
  'mongodb://algobullstradingsolutions:p%26ol5Hd%26trad%26i@193.239.237.92:27017/',
  'mongodb://intelfintech:ugh%265rK86%26Fv%26yn37A%26@185.209.75.61:27017/',
  'mongodb://algokuber:p%26k506%267G%26y%26vnd%26@217.145.69.44:27017/',
  'mongodb://finnshri:p0%26k506%267s9Ry%26vn8d@217.145.69.46:27017/',
  'mongodb://visioniq:%26k%23sA8B%267Gmg%26vn3%237A%26@185.209.75.2:27017/',
  'mongodb://believetechnology:%26k%23sA8B%237Gsq%26vg3%237P%26@185.209.75.5:27017/',
  'mongodb://growskyinfotech:u%26j8gB85%267GN%26vn37m%26@185.209.75.9:27017/',
  'mongodb://inspirealgo:n%26pdF7G%265Png%26vn97A%26@185.209.75.11:27017/',
  'mongodb://uniquetechnology:c%26z9yB73%267Fn%26vn98V%26@185.209.75.12:27017/',
  'mongodb://yourstechexpert:sA8k%26n86%267Mv%26fh57B%26@185.209.75.14:27017/',
  'mongodb://alphapulsepro:un%26r4hv93%267Gr%26v%2637P%26@185.209.75.15:27017/',
  'mongodb://sumedhainnovations:p%26k5H6%267GsRy%26vnd@185.209.75.21:27017/',
  'mongodb://tradeonn:pw%26k5H6%267GsRy%26vn@185.209.75.23:27017/',
  'mongodb://cpandit:im%3DCtv%7BOu%235V9QT%25@172.105.48.186:27017/',
  'mongodb://growupalgo:p%26k5H6%267GsRy%26vnd@185.209.75.22:27017/',
  'mongodb://robotexfintech:z43rk%265eF32%267Pcmn9i7B%26@185.209.75.28:27017/',
  'mongodb://metaprogramming:zc%26u9tD828Tnbh3u7A%26@185.209.75.29:27017/',
  'mongodb://fincodify:u%26v5%26bAn6%265Gv%26cn29A%26@185.209.75.30:27017/',
  'mongodb://invicontechnology:k56ck%265eF89%267Phjn9i7B%26@185.209.75.62:27017/',
  'mongodb://sstechnologiess:Apw%26k5RH6%267GsRy%26vnM@185.209.75.64:27017/',
  'mongodb://skwinvestmentadviser:Tapw%26k5R56%267GsRy%26vnTy@185.209.75.65:27017/',
  'mongodb://satviktech:Apw%26k5R6%267GsRy%26vnM@185.209.75.66:27017/',
  'mongodb://thinkaumatictechnology:Aapw%26k5R56%267GsRy%26vnT@185.209.75.67:27017/',
  'mongodb://visionresearchandsolution:Apw%26k5R56%267GsRy%26vn@185.209.75.68:27017/',
  'mongodb://smartwavetechnology:Aapw%26k5R56%267GsRy%26vnTy@185.209.75.69:27017/',
  'mongodb://inteltrade:Tapw%26k5R56%267GsRy%26n@185.209.75.180:27017/',
  'mongodb://fintechit:Tapw%26k5R56%267GsRy%26nP@185.209.75.181:27017/',
  'mongodb://thrivinginfotech:TGw%26k5RT56%267GsRy%26nP@185.209.75.182:27017/',
  'mongodb://visioncodesoftware:TGw%26k5RT56%267GsRy%26HR@185.209.75.184:27017/',
  'mongodb://brightextech:T5wP%26k5T56%267GsRy%26M@185.209.75.185:27017/',
  'mongodb://shinesofttrade:T5wP%26k56T56%267GsRy%26H@185.209.75.186:27017/',
  'mongodb://algoruns:Tw%26k5RT56%267GsRy%26HR@185.209.75.187:27017/',
  'mongodb://brillianttechit:T5wP&k5T567GsRy&M@185.209.75.251:27017/',
  'mongodb://newtimetechnologies:H5wP%26k5T567GsRy%26MT@185.209.75.252:27017/',
  'mongodb://darixosolution:M5wP%26k5T567GsRy%26MT@185.209.75.254:27017/',
  'mongodb://magmamultitrade:M5P%26k5T567GsRy%26MT@185.209.75.253:27017/',
  'mongodb://intravisor:M5RP%26k5T567GsRy%26MT@185.209.75.191:27017/',
  'mongodb://procodetechnology:M5RP%26k5T567GRy%26MT@185.209.75.192:27017/',
  'mongodb://unitythesmartalgo:M5RP%26k5T567GsRy%26MT@185.209.75.190:27017/',
  'mongodb://smartstox:MM5RP%26k5T567GRy%26MT@185.209.75.193:27017/',
  'mongodb://visionmatictechnology:MM5P%26k5T567GRy%26MT@185.209.75.194:27017/',
  'mongodb://winwaysoftwares:MM5P%26k5T567Gy%26MT@185.209.75.195:27017/',
  'mongodb://onealgo:MM5P&k5T567Gy&Ma@185.209.75.196:27017/',
  'mongodb://unityhubitsolution:MM5P%26k5T567Gy%26MTa@185.209.75.197:27017/',
  'mongodb://techelitesolution:MWQ5RP%26k5T567Gy%26Ma@193.239.237.31:27017/',
  'mongodb://algosparks:MW5R%26k5FT567Gy%26Ma@217.145.69.27:27017/',
  'mongodb://ssfintech:MW5RP%26k5T567Gy%26Ma@193.239.237.114:27017/',
  'mongodb://rainfotech:MWQ5RP%26k5T567Gy%26Ma@193.239.237.38:27017/',
  'mongodb://technofin:MWQ5RP%26k5T567Gy%26Ma@217.145.69.31:27017/',
  'mongodb://evolgo:AMWQ5RP%26kT567Gy%26Maa@185.209.75.88:27017/',
  'mongodb://growonntechnologies:AaMWQ5RP%26kT567Gy%26Maa@185.209.75.89:27017/',
  'mongodb://tradejockey:AaMWQ5RP%26kT567Gy%26Ma@185.209.75.90:27017/',
  'mongodb://growingtech:Taw%26k5RT56%267GsRy%26nP@185.209.75.183:27017/',
  'mongodb://inovateinfotech:Tawk5RT56&7GsRy&n@5.178.98.3:27017/',
  'mongodb://algobliss:Tawk5RT6%267GsRy%26n@5.178.98.5:27017/',
  'mongodb://idealalgo:Tawk5RT6%26GsRy%26n@5.178.98.6:27017/',
  'mongodb://algomoneybooster:AMQ5RP%26kT567Gy%26Maa@5.178.98.8:27017/',
  'mongodb://eaglesofttech:AMQ5RP%26kT567Gy%26Maa@5.178.98.9:27017/',
  'mongodb://algoweb:Tawk5RT56%26y7GsRy%26n@5.178.98.11:27017/',
  'mongodb://celestialai:Twk5RT56%26y7GsRy%26n@5.178.98.13:27017/',
  'mongodb://dynamictechsolution:Twk5RT56%26y7GsRy%26n@5.178.98.15:27017/',
  'mongodb://nextbrandcom:Twk5RT56%26y7GsRy%26n2@5.178.98.19:27017/',
  'mongodb://realcloudtechnology:Twk5RT56%26y7GsRy%26n2@5.178.98.17:27017/',
  'mongodb://moneyplatform:Twk5RT56%26y7GsRy%26nT@5.178.98.20:27017/',
  'mongodb://infraitsolution:Tk5RT56%26y7GsRy%26nT@185.209.75.71:27017/',
  'mongodb://fincapex:p%26k5H6%267GsRy%26vnd@185.209.75.22:27017/',
  'mongodb://reliablealgo:sA8k%26n86%267Mv%26fh57B%26@185.209.75.14:27017/',
  'mongodb://researchfactory:un%26r4hv93%267Gr%26v%2637P%26@185.209.75.15:27017/',
  'mongodb://visionalgotech:T5wP%26k5T56%267GsRy%26H@185.209.75.250:27017/',
  'mongodb://linkupinfotech:%26k%23sA8B%267Gmg%26vn3%237A%26@185.209.75.2:27017/',
  'mongodb://microninfotech1:p%26k5H6%267GsRy%26vnd%26@217.145.69.40:27017/',
  'mongodb://growfuturetechnology:MM5P%26k5T567Gy%26MT@185.209.75.195:27017/',
  'mongodb://oneplanetitsolution:z43rk%265eF32%267Pcmn9i7B%26@185.209.75.28:27017/',
  'mongodb://danoneitsolution:p%26k5H6%267GsRy%26vnd%26@217.145.69.76:27017/',
  'mongodb://ccconnect:Apw%26k5R6%267GsRy%26vnM@185.209.75.66:27017/'

];

const dbName = 'test';
const collectionName = 'categories';



async function bulkUpdateCategories(uri) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Create bulk operations array
    const bulkOps = dataToUpdate.map(item => {
      return {
        updateOne: {
          filter: { category_id: item.category_id }, // Or use _id: item._id if _id is used as identifier
          update: {
            $set: {
              name: item.name,
              segment: item.segment,
              status: item.status,
              CID: item.CID,
              createdAt: item.createdAt,
              __v: item.__v
            }
          },
          upsert: true
        }
      };
    });

    // Perform bulk write
    const result = await collection.bulkWrite(bulkOps);
    console.log(`Bulk update result for ${uri}:`, result);
  } catch (error) {
    console.error(`Error updating categories for ${uri}:`, error);
  } finally {
    await client.close();
  }
}

async function updateAllDatabases() {
  const updatePromises = databaseUrls.map((dbUrl) => bulkUpdateCategories(dbUrl));
  await Promise.all(updatePromises);
  console.log('All databases updated');
}

// Run the update
updateAllDatabases().catch(console.error);
