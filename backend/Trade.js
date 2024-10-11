const axios = require("axios");
// let data = JSON.stringify([{
//   "complexty": "REGULAR",
//   "discqty": "0",
//   "exch": "NFO",
//   "pCode": "MIS",
//   "prctyp": "MKT",
//   "price": "",
//   "qty": 15,
//   "ret": "DAY",
//   "stopLoss": "",
//   "symbol_id": "43780",
//   "trading_symbol": "BANKNIFTY16OCT24C52200",
//   "trailing_stop_loss": "0",
//   "transtype": "BUY",
//   "trigPrice": ""
// }]);

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
//   headers: {
//     'Authorization': 'Bearer 1548891 eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE3MzM3MTMxMDgsImlhdCI6MTcyODUzNTEzMSwianRpIjoiOTFlOGYyZDYtZWNmOC00Y2VlLThhYzUtOGE5MWVkMmJiMmIyIiwiaXNzIjoiaHR0cHM6Ly9pZGFhcy5hbGljZWJsdWVvbmxpbmUuY29tL2lkYWFzL3JlYWxtcy9BbGljZUJsdWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiOThhMjYyOTgtNzlkZC00M2E1LTg4MTMtMGFmNjQzMGU1ZjFlIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWxpY2Uta2IiLCJzaWQiOiI0MTMyYjM0NS0zMTE0LTQ0MzQtOGUzNS1mZjViN2JiMDU1NWEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIG9wZW5pZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1Y2MiOiIxNTQ4ODkxIiwiY2xpZW50Um9sZSI6WyJHVUVTVF9VU0VSIiwiQUNUSVZFX1VTRVIiXSwibmFtZSI6IkZFUk9aIEFCRFVMU0FUVEFSIE1PSEFNTUVEIiwibW9iaWxlIjoiODA4NzA2MjY2OCIsInByZWZlcnJlZF91c2VybmFtZSI6IjE1NDg4OTEiLCJnaXZlbl9uYW1lIjoiRkVST1ogQUJEVUxTQVRUQVIgTU9IQU1NRUQiLCJlbWFpbCI6Im1vaGFtbWFkZmVyb3o4MDg3QGdtYWlsLmNvbSJ9.WoDHJXP29nmQlx4veDSukweAWhKnVc05uNZl0xk6HyXtpnTKKKODM05rZ0i0sqPjPzAW5UhqkV23spgZsIQHIgTkPh_3HTVfMOozA5p-zQS1Y4kVOu13-BnFCL2xTuymm9nGAkbt3miLiO3_N5VP3f8qZKOEOOrotmUgikimveLGk6ryaAMPiqqPs4fSnpqLPN0Uf8Rn-FjlHR3yAkGWoY8yDGrjgRDpV2Ne4l8sCjzocLX2YtvqbNd_F-ySRjI42TsU_ji79fkkTvEr9NwSJhASPwQWveVy-3UNIPrSedvpi1YE30AbNQ16DzCsRueNG_XFP6Xtjc-rO5oM9w1IDQ',
//     'Content-Type': 'application/json'
//   },
//   data : data
// };

// axios.request(config)
// .then((response) => {
//   console.log(response.data);
// })
// .catch((error) => {
//   console.log(error);
// });

// '[{"complexty":"REGULAR","discqty":"0","exch":"NFO","pCode":"MIS","prctyp":"MKT","price":"","qty":100,"ret":"DAY","stopLoss":"0","symbol_id":"47166","trading_symbol":"NIFTY10OCT24C24950","trailing_stop_loss":"0","transtype":"BUY","trigPrice":"0"}]'

const postOrder = async () => {
  try {
    const response = await axios.post(
      "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder",
      [
        {
          complexty: "REGULAR",
          discqty: "0",
          exch: "NFO",
          pCode: "MIS",
          prctyp: "MKT",
          price: "", // Ensure empty price is acceptable
          qty: 50,
          ret: "DAY",
          stopLoss: "0",
          symbol_id: "47166",
          trading_symbol: "NIFTY10OCT24C24950",
          trailing_stop_loss: "0",
          transtype: "BUY",
          trigPrice: "0",
        },
      ],
      {
        headers: {
          Authorization:
            "Bearer 438760 eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE3MzM3MjY1NTAsImlhdCI6MTcyODU0MjgxMywianRpIjoiNjY4MTA4OGQtNjhkMy00ZjA1LThmYzgtMGJmZTVjODNkOWQ5IiwiaXNzIjoiaHR0cHM6Ly9pZGFhcy5hbGljZWJsdWVvbmxpbmUuY29tL2lkYWFzL3JlYWxtcy9BbGljZUJsdWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYzk3MzNhN2UtNmMxMy00OTZhLWJlOGQtOWIyNzgwZGExNjk5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWxpY2Uta2IiLCJzaWQiOiI1ODE1NWJlYS0xZGIzLTQwYzQtODY5My1hYTc1MmRhNzUxOTkiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIG9wZW5pZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1Y2MiOiI0Mzg3NjAiLCJjbGllbnRSb2xlIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdLCJuYW1lIjoiU0hBS0lSIEhVU1NBSU4iLCJtb2JpbGUiOiI3OTk5Mjk3Mjc1IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiNDM4NzYwIiwiZ2l2ZW5fbmFtZSI6IlNIQUtJUiIsImZhbWlseV9uYW1lIjoiSFVTU0FJTiIsImVtYWlsIjoic2hha2lya2hhbjEyMzgyQGdtYWlsLmNvbSJ9.CmV76VgSFR0g3U9ZzZM9FVuHSBnV8QqrjqsZrkOusuTxS_cFEoMJRscbLzmf7RdratvD4Wvb4AinVAU5TdYNld3t2bjCHKv1-HObQaatfhBWqGGHRUI8tWy-Hp24rOEed2GQ4UCeVqhL1I3oFZUCibSDGs-buKknQmY1SbTblnudAtXhNbnp_ptjkVA2IXnyaoSLWmcoLdm7W3tGx1qIvDL_hBPGyXoFv168C239vEDhVee4c5hyRRXX53tamgElYsOsC0B2Hqa_LXnOOL2agQI8z86n9sF__2cBZF4yrt_MFi3n8oi02EaQCPzR6v38pnFmHIq7Rz_4FxC5N4sjig",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response);
  } catch (error) {
    console.log(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};




const OrderPosition = async () => {
    try {
      const response = await axios.post(
        "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/positionAndHoldings/positionBook",
        {
            "ret":"DAY"
        },
        {
          headers: {
            Authorization:
              "Bearer 1548891 eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE3MzM3MTMxMDgsImlhdCI6MTcyODUzNTEzMSwianRpIjoiOTFlOGYyZDYtZWNmOC00Y2VlLThhYzUtOGE5MWVkMmJiMmIyIiwiaXNzIjoiaHR0cHM6Ly9pZGFhcy5hbGljZWJsdWVvbmxpbmUuY29tL2lkYWFzL3JlYWxtcy9BbGljZUJsdWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiOThhMjYyOTgtNzlkZC00M2E1LTg4MTMtMGFmNjQzMGU1ZjFlIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWxpY2Uta2IiLCJzaWQiOiI0MTMyYjM0NS0zMTE0LTQ0MzQtOGUzNS1mZjViN2JiMDU1NWEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIG9wZW5pZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1Y2MiOiIxNTQ4ODkxIiwiY2xpZW50Um9sZSI6WyJHVUVTVF9VU0VSIiwiQUNUSVZFX1VTRVIiXSwibmFtZSI6IkZFUk9aIEFCRFVMU0FUVEFSIE1PSEFNTUVEIiwibW9iaWxlIjoiODA4NzA2MjY2OCIsInByZWZlcnJlZF91c2VybmFtZSI6IjE1NDg4OTEiLCJnaXZlbl9uYW1lIjoiRkVST1ogQUJEVUxTQVRUQVIgTU9IQU1NRUQiLCJlbWFpbCI6Im1vaGFtbWFkZmVyb3o4MDg3QGdtYWlsLmNvbSJ9.WoDHJXP29nmQlx4veDSukweAWhKnVc05uNZl0xk6HyXtpnTKKKODM05rZ0i0sqPjPzAW5UhqkV23spgZsIQHIgTkPh_3HTVfMOozA5p-zQS1Y4kVOu13-BnFCL2xTuymm9nGAkbt3miLiO3_N5VP3f8qZKOEOOrotmUgikimveLGk6ryaAMPiqqPs4fSnpqLPN0Uf8Rn-FjlHR3yAkGWoY8yDGrjgRDpV2Ne4l8sCjzocLX2YtvqbNd_F-ySRjI42TsU_ji79fkkTvEr9NwSJhASPwQWveVy-3UNIPrSedvpi1YE30AbNQ16DzCsRueNG_XFP6Xtjc-rO5oM9w1IDQ",
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Response:", response.data);
    } catch (error) {
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };
  





postOrder();

// OrderPosition()
