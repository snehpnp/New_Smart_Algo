import {CreateSocketSession,ConnctSocket} from "../../../Service/Alice_Socket";
import { ShowColor1} from "../../../Utils/ShowTradeColor";
import $ from "jquery";


//  SHOW lIVE PRICE
export const FunctionForLivePriceCalculation = async (CreatechannelList, UserDetails, setSocketState, tradeHistoryData) => {

    let type = { loginType: "API" };
    let channelList = CreatechannelList;


    if (UserDetails.user_id !== undefined && UserDetails.access_token !== undefined && UserDetails.trading_status == "on") {


        const res = await CreateSocketSession(type, UserDetails.user_id, UserDetails.access_token);

        if (res.status === 200) {
            setSocketState("Ok");
        }
        if (res.status === 401 || res.status === '401') {
            setSocketState("Unauthorized");

            tradeHistoryData && tradeHistoryData.forEach((row, i) => {
                const previousRow = i > 0 ? tradeHistoryData && tradeHistoryData[i - 1] : null;
                calcultateRPL(row, null, previousRow);
            });
        }
        else {
            if (res.data.stat) {
                const handleResponse = async (response) => {


                    $('.BP1_Put_Price_' + response.tk).html();
                    $('.SP1_Call_Price_' + response.tk).html();

                    // UPL_
                    $(".LivePrice_" + response.tk).html(response.lp);
                    $(".ClosePrice_" + response.tk).html(response.c);


                    var live_price = response.lp === undefined ? "" : response.lp;
                    //  if entry qty and exist qty both exist
                    tradeHistoryData && tradeHistoryData.forEach((row, i) => {
                             
     


                        let get_ids = '_id_' + response.tk + '_' + row._id
                        let get_id_token = $('.' + get_ids).html();

                        const get_entry_qty = $(".entry_qty_" + response.tk + '_' + row._id).html();
                        const get_exit_qty = $(".exit_qty_" + response.tk + '_' + row._id).html();
                        const get_exit_price = $(".exit_price_" + response.tk + '_' + row._id).html();
                        const get_entry_price = $(".entry_price_" + response.tk + '_' + row._id).html();
                        const get_entry_type = $(".entry_type_" + response.tk + '_' + row._id).html();
                        const get_exit_type = $(".exit_type_" + response.tk + '_' + row._id).html();
                        const get_Strategy = $(".strategy_" + response.tk + '_' + row._id).html();


                       


                    if ((get_entry_type === "LE" && get_exit_type === "LX") || (get_entry_type === "SE" && get_exit_type === "SX")) {

                     
                      
                        if (get_entry_qty !== "" && get_exit_qty !== "") {

                            if (parseInt(get_entry_qty) >= parseInt(get_exit_qty)) {
                    


                                    let rpl = (parseFloat(get_exit_price) - parseFloat(get_entry_price)) * parseInt(get_exit_qty);

                                    if(get_entry_type === "SE"){
                                        rpl = (parseFloat(get_entry_price) - parseFloat(get_exit_price)) * parseInt(get_exit_qty);
                                      }


                                      if( ["FO", "MFO", "CFO", "BFO"].includes(row.segment.toUpperCase()) && row.option_type.toUpperCase() == "PUT"){
                        
                                        rpl = (parseFloat(get_entry_price) - parseFloat(get_exit_price)) * parseInt(get_exit_qty);
                        
                                        if(get_entry_type === "SE"){
                                          rpl = (parseFloat(get_exit_price) - parseFloat(get_entry_price)) * parseInt(get_exit_qty);
                                        }
                                      
                                      }

                                 

                                    let upl = parseInt(get_exit_qty) - parseInt(get_entry_qty);
                                    let finalyupl = (parseFloat(get_entry_price) - parseFloat(live_price)) * upl;

                                    

                                    if ((isNaN(finalyupl) || isNaN(rpl))) {
                                        return "-";
                                    } else {
                                        $(".show_rpl_" + response.tk + "_" + get_id_token).html(rpl.toFixed(2));
                                        $(".UPL_" + response.tk + "_" + get_id_token).html(finalyupl.toFixed(2));
                                        $(".TPL_" + response.tk + "_" + get_id_token).html((finalyupl + rpl).toFixed(2));

                                        ShowColor1(".show_rpl_" + response.tk + "_" + get_id_token, rpl.toFixed(2), response.tk, get_id_token);
                                        ShowColor1(".UPL_" + response.tk + "_" + get_id_token, finalyupl.toFixed(2), response.tk, get_id_token);
                                        ShowColor1(".TPL_" + response.tk + "_" + get_id_token, (finalyupl + rpl).toFixed(2), response.tk, get_id_token);
                                    }
                                }
                            }
                        }
                        //  if Only entry qty Exist
                        else if ((get_entry_type === "LE" && get_exit_type === "") || (get_entry_type === "SE" && get_exit_type === "")) {

                            let abc = ((parseFloat(live_price) - parseFloat(get_entry_price)) * parseInt(get_entry_qty)).toFixed();
                           

                            if(get_entry_type === "SE"){
                                abc = ((parseFloat(get_entry_price) - parseFloat(live_price)) * parseInt(get_entry_qty)).toFixed();
                              }


                              if( ["FO", "MFO", "CFO", "BFO"].includes(row.segment.toUpperCase()) && row.option_type.toUpperCase() == "PUT"){
                        
                                abc = (parseFloat(get_entry_price) - parseFloat(live_price)) * parseInt(get_exit_qty);
                
                                if(get_entry_type === "SE"){
                                  abc = (parseFloat(live_price) - parseFloat(get_entry_price)) * parseInt(get_exit_qty);
                                }
                              
                              }
                           
                           
                            if (isNaN(abc)) {
                                return "-";
                            } else {
                                $(".show_rpl_" + response.tk + "_" + get_id_token).html("-");
                                $(".UPL_" + response.tk + "_" + get_id_token).html(abc);
                                $(".TPL_" + response.tk + "_" + get_id_token).html(abc);
                                ShowColor1(".show_rpl_" + response.tk + "_" + get_id_token, "-", response.tk, get_id_token);
                                ShowColor1(".UPL_" + response.tk + "_" + get_id_token, abc, response.tk, get_id_token);
                                ShowColor1(".TPL_" + response.tk + "_" + get_id_token, abc, response.tk, get_id_token);

                            }

                        }

                        //  if Only Exist qty Exist
                        else if (
                            (get_entry_type === "" && get_exit_type === "LX") ||
                            (get_entry_type === "" && get_exit_type === "SX")
                        ) {
                        } else {
                        }


                    });





                    // }
                };
                await ConnctSocket(handleResponse, channelList, UserDetails.user_id, UserDetails.access_token).then((res) => { });
            } else {
                // $(".UPL_").html("-");
                // $(".show_rpl_").html("-");
                // $(".TPL_").html("-");
            }
        }
    }
     else{
       
        tradeHistoryData && tradeHistoryData.forEach((row, i) => {
         
     
          let get_ids = '_id_' + row.token + '_' + row._id
          let get_id_token = $('.' + get_ids).html();
  
          const get_entry_qty = $(".entry_qty_" + row.token + '_' + row._id).html();
          const get_exit_qty = $(".exit_qty_" + row.token + '_' + row._id).html();
          const get_exit_price = $(".exit_price_" + row.token + '_' + row._id).html();
          const get_entry_price = $(".entry_price_" + row.token + '_' + row._id).html();
          const get_entry_type = $(".entry_type_" + row.token + '_' + row._id).html();
          const get_exit_type = $(".exit_type_" + row.token + '_' + row._id).html();
          const get_Strategy = $(".strategy_" + row.token + '_' + row._id).html();
  
  
          if ((get_entry_type === "LE" && get_exit_type === "LX") || (get_entry_type === "SE" && get_exit_type === "SX")) {

  
            if (get_entry_qty !== "" && get_exit_qty !== "") {
  
              if (parseInt(get_entry_qty) == parseInt(get_exit_qty)) {
  
  
                let rpl = (parseFloat(get_exit_price) - parseFloat(get_entry_price)) * parseInt(get_exit_qty);

                if(get_entry_type === "SE"){
                    rpl = (parseFloat(get_entry_price) - parseFloat(get_exit_price)) * parseInt(get_exit_qty);
                  }

                  if( ["FO", "MFO", "CFO", "BFO"].includes(row.segment.toUpperCase()) && row.option_type.toUpperCase() == "PUT"){
                        
                    rpl = (parseFloat(get_entry_price) - parseFloat(get_exit_price)) * parseInt(get_exit_qty);
    
                    if(get_entry_type === "SE"){
                      rpl = (parseFloat(get_exit_price) - parseFloat(get_entry_price)) * parseInt(get_exit_qty);
                    }
                  
                  }
                 
                
   
                let upl = parseInt(get_exit_qty) - parseInt(get_entry_qty);
                let finalyupl = (parseFloat(get_entry_price) - parseFloat(get_exit_price)) * upl;

               


  
                if ((isNaN(finalyupl) || isNaN(rpl))) {
                  return "-";
                } else {
                  $(".show_rpl_" + row.token + "_" + get_id_token).html(rpl.toFixed(2));
                  $(".UPL_" + row.token + "_" + get_id_token).html(finalyupl.toFixed(2));
                  $(".TPL_" + row.token + "_" + get_id_token).html((finalyupl + rpl).toFixed(2));
  
                  ShowColor1(".show_rpl_" + row.token + "_" + get_id_token, rpl.toFixed(2), row.token, get_id_token);
                  ShowColor1(".UPL_" + row.token + "_" + get_id_token, finalyupl.toFixed(2), row.token, get_id_token);
                  ShowColor1(".TPL_" + row.token + "_" + get_id_token, (finalyupl + rpl).toFixed(2), row.token, get_id_token);
                }
              }
            }
          }
          //  if Only entry qty Exist
          else if ((get_entry_type === "LE" && get_exit_type === "") || (get_entry_type === "SE" && get_exit_type === "")) {
            let abc = ((parseFloat(get_exit_price) - parseFloat(get_entry_price)) * parseInt(get_entry_qty)).toFixed();


            if(get_entry_type === "SE"){
                abc = ((parseFloat(get_entry_price) - parseFloat(get_exit_price)) * parseInt(get_entry_qty)).toFixed();
              }

              if( ["FO", "MFO", "CFO", "BFO"].includes(row.segment.toUpperCase()) && row.option_type.toUpperCase() == "PUT"){
                        
                abc = (parseFloat(get_entry_price) - parseFloat(get_exit_price)) * parseInt(get_exit_qty);

                if(get_entry_type === "SE"){
                  abc = (parseFloat(get_exit_price) - parseFloat(get_entry_price)) * parseInt(get_exit_qty);
                }
              
              }


            if (isNaN(abc)) {
              return "-";
            } else {
              $(".show_rpl_" + row.token + "_" + get_id_token).html("-");
              $(".UPL_" + row.token + "_" + get_id_token).html(abc);
              $(".TPL_" + row.token + "_" + get_id_token).html(abc);
              ShowColor1(".show_rpl_" + row.token + "_" + get_id_token, "-", row.token, get_id_token);
              ShowColor1(".UPL_" + row.token + "_" + get_id_token, abc, row.token, get_id_token);
              ShowColor1(".TPL_" + row.token + "_" + get_id_token, abc, row.token, get_id_token);
            }
          }
  
          //  if Only Exist qty Exist
          else if (
            (get_entry_type === "" && get_exit_type === "LX") ||
            (get_entry_type === "" && get_exit_type === "SX")
          ) {
          } else {
          }
  
  
  
  
  
        });
  
  
     }


};



const calcultateRPL = (row, livePrice, pre_row) => {

    let get_ids = '_id_' + row.token + '_' + row._id
    let get_id_token = $('.' + get_ids).html();

    // // // if(row pre_row)
    if (row.entry_type !== '' && row.exit_type !== '') {
        if ((row.entry_type === "LE" || row.entry_type === "SE")) {

            // if (row. pre_row)
            const entryQty = parseInt(row.entry_qty_percent);
            const exitQty = parseInt(row.exit_qty_percent);
            const entryPrice = parseFloat(row.entry_price);
            const exitPrice = parseFloat(row.exit_price);
            const rpl = (exitPrice - entryPrice) * Math.min(entryQty, exitQty);

  

            $(".show_rpl_" + row.token + "_" + get_id_token).html(rpl.toFixed(2));
            $(".UPL_" + row.token + "_" + get_id_token).html("-");
            $(".TPL_" + row.token + "_" + get_id_token).html(rpl.toFixed(2));

            ShowColor1(".show_rpl_" + row.token + "_" + get_id_token, rpl.toFixed(2), row.token, get_id_token);
            ShowColor1(".UPL_" + row.token + "_" + get_id_token, "-", row.token, get_id_token);

            ShowColor1(".TPL_" + row.token + "_" + get_id_token, rpl.toFixed(2), row.token, get_id_token);


        }

    }
    else if (row.entry_type && row.exit_type === "") {

        // $(".show_rpl_" + row.token).html('-');
        // $(".TPL_" + row.token).html('-');
        // $(".UPL_" + row.token).html("-");


        $(".show_rpl_" + row.token + "_" + row._id).html("-");
        $(".UPL_" + row.token + "_" + row._id).html("-");
        $(".TPL_" + row.token + "_" + row._id).html("-");
    }
    if (row.entry_type === "" && row.exit_type !== '') {
        // $(".show_rpl_" + row.token).html('-');
        // $(".TPL_" + row.token).html('-');
        // $(".UPL_" + row.token).html("-");


        $(".show_rpl_" + row.token + "_" + row._id).html("-");
        $(".UPL_" + row.token + "_" + row._id).html("-");
        $(".TPL_" + row.token + "_" + row._id).html("-");
    }
};
