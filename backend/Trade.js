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
    "complexty": "REGULAR",
    "discqty": "0",
    "exch": "NFO",
    "pCode": "MIS",
    "prctyp": "MKT",
    "price": "0",
    "qty": 15,
    "ret": "DAY",
    "stopLoss": "",
    "symbol_id": "43745",
    "trading_symbol": "BANKNIFTY16OCT24C51800",
    "trailing_stop_loss": "0",
    "transtype": "SELL",
    "trigPrice": ""
}
      ],
      {
        headers: {
          Authorization:
          "Bearer 1487986 eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE3MzQxNDgzNzksImlhdCI6MTcyODk2NDM5NSwianRpIjoiZWZiZTI4MTAtMWY0Yi00MjY3LTk0ZDgtOTI0MzM0NTgzZTlhIiwiaXNzIjoiaHR0cHM6Ly9pZGFhcy5hbGljZWJsdWVvbmxpbmUuY29tL2lkYWFzL3JlYWxtcy9BbGljZUJsdWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNjI1MzkzMTQtZDk0Yi00N2Q4LTlmMjctNzUzNTNiODVmMDAzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWxpY2Uta2IiLCJzaWQiOiJhYWZiMTBlMC1kMTg2LTQzYzMtOTNhMy1iNTk1ZThmODNjZjkiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIG9wZW5pZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1Y2MiOiIxNDg3OTg2IiwiY2xpZW50Um9sZSI6WyJHVUVTVF9VU0VSIiwiQUNUSVZFX1VTRVIiXSwibmFtZSI6IlNBTkpBWSBLVU1BUiIsIm1vYmlsZSI6Ijk5MjI0NDgwNzAiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIxNDg3OTg2IiwiZ2l2ZW5fbmFtZSI6IlNBTkpBWSBLVU1BUiIsImVtYWlsIjoic2ttYWlsMTE5MkBnbWFpbC5jb20ifQ.eJyiemjMiZ0ygjR_THQwhi9wZ2jJzoO_v_H2CtJhFWxaHYonOUFgpcMiFL6mVEft8wb78uQGGX2GU6PilbxMRxTAMRWhGLjImoF-66xHrkBh3b0TZ2gXbg_MI0Gsf2jvg1aWoh2eRubnq2F37FETf34ZoF7b5SfiLoLnCDMtDF573TBVS1bfeCbgJJDuDaawXs9JjFuG1JzOUa_xr9Yl5Ir1Z305LDgCi3HDZVQcEWFGwTPbl_i-qX40-gW2rS0emX__GCaCpbsLDkrPeyy1X85PN1ps5OoOm7i_b_i2wdfDSERHczPMNHdkGaB7ab4tk3BpNVy1eSkXA9iNycqXfA",
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
            "Bearer 1352932 eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE3MzQxNDY4NDIsImlhdCI6MTcyOTA1MTE1MCwianRpIjoiMzE3ZmMwNmItNmU0MS00MDQwLTg1MmEtMTcyMDYwZmI3YTUwIiwiaXNzIjoiaHR0cHM6Ly9pZGFhcy5hbGljZWJsdWVvbmxpbmUuY29tL2lkYWFzL3JlYWxtcy9BbGljZUJsdWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMDI3MGNmMDUtZDI5Ny00MzVlLWI4MDQtN2RjMDNjMTY1Yzk4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWxpY2Uta2IiLCJzaWQiOiI1YzE3NjA1Yy1hYzY2LTQwMzgtOGVkMS1hYzQ1ZTc2NGY5YjgiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIG9wZW5pZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1Y2MiOiIxMzUyOTMyIiwiY2xpZW50Um9sZSI6WyJHVUVTVF9VU0VSIiwiQUNUSVZFX1VTRVIiXSwibmFtZSI6IlZJS0FMIFBSQUtBU0ggSkFJTiIsIm1vYmlsZSI6Ijk4MTk0MDIxODciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIxMzUyOTMyIiwiZ2l2ZW5fbmFtZSI6IlZJS0FMIFBSQUtBU0ggSkFJTiIsImVtYWlsIjoiam4udmlrYWxAZ21haWwuY29tIn0.Jp3JQn6oMo_sHb2Y85NhYMfi1NlJCyFmyRgRT6eB1Q5ikE4dnvq2z4io3_VWkjk_dydrwuVHylLBLcQrT0wttwk7cMqAu7NqLgqSQm2k9vkIQ7oMP_g7YJyC8_vW6QxhQ9g3LSC_yyXTiwxSCoaLjyIaLMZP-xcdnjeLfUjXduUu1nDAzk99S7NIp9CXjTd50I0Guc91NwLYYgxtzpF4RDRaaHGp0PhQOOQai0N7U0v2wN6qVaT2Y_O4vjuEJP4zAIIIWMPOpzm791ATZgS-QmuXH0XdS5R41KCHjd2Ky4gGZfNLKh1fA6ZmtcwjbBeKMDCY4-Kd12kMhWQAtHvdHA",
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
  

  // var data_order = {
  //   nestOrderNumber: "24101600054741",
  // };
  
  // const Order = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/fetchTradeBook",
      
  //       {
  //         headers: {
  //           Authorization:
  //             "Bearer 1352932 eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE3MzQxNDY4NDIsImlhdCI6MTcyOTA1MTE1MCwianRpIjoiMzE3ZmMwNmItNmU0MS00MDQwLTg1MmEtMTcyMDYwZmI3YTUwIiwiaXNzIjoiaHR0cHM6Ly9pZGFhcy5hbGljZWJsdWVvbmxpbmUuY29tL2lkYWFzL3JlYWxtcy9BbGljZUJsdWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMDI3MGNmMDUtZDI5Ny00MzVlLWI4MDQtN2RjMDNjMTY1Yzk4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWxpY2Uta2IiLCJzaWQiOiI1YzE3NjA1Yy1hYzY2LTQwMzgtOGVkMS1hYzQ1ZTc2NGY5YjgiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIG9wZW5pZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1Y2MiOiIxMzUyOTMyIiwiY2xpZW50Um9sZSI6WyJHVUVTVF9VU0VSIiwiQUNUSVZFX1VTRVIiXSwibmFtZSI6IlZJS0FMIFBSQUtBU0ggSkFJTiIsIm1vYmlsZSI6Ijk4MTk0MDIxODciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIxMzUyOTMyIiwiZ2l2ZW5fbmFtZSI6IlZJS0FMIFBSQUtBU0ggSkFJTiIsImVtYWlsIjoiam4udmlrYWxAZ21haWwuY29tIn0.Jp3JQn6oMo_sHb2Y85NhYMfi1NlJCyFmyRgRT6eB1Q5ikE4dnvq2z4io3_VWkjk_dydrwuVHylLBLcQrT0wttwk7cMqAu7NqLgqSQm2k9vkIQ7oMP_g7YJyC8_vW6QxhQ9g3LSC_yyXTiwxSCoaLjyIaLMZP-xcdnjeLfUjXduUu1nDAzk99S7NIp9CXjTd50I0Guc91NwLYYgxtzpF4RDRaaHGp0PhQOOQai0N7U0v2wN6qVaT2Y_O4vjuEJP4zAIIIWMPOpzm791ATZgS-QmuXH0XdS5R41KCHjd2Ky4gGZfNLKh1fA6ZmtcwjbBeKMDCY4-Kd12kMhWQAtHvdHA",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  
  //     console.log("Response:", response.data);
  //   } catch (error) {
  //     console.log(
  //       "Error:",
  //       error.response ? error.response.data : error.message
  //     );
  //   }
  // };
  


// postOrder();

OrderPosition()

// Order()