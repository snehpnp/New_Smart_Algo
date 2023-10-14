

import DetailsView from "./DetailsView";
import {
    GetAliceTokenAndID,
    CreateSocketSession,
    ConnctSocket,

} from "../../../Service/Alice_Socket";
import $ from "jquery";
import { ShowColor, ShowColor_Compare_two, } from "../../../Utils/ShowTradeColor";



export const FunctionForLivePriceCalculation = async (CreatechannelList, UserDetails, setSocketState, tradeHistoryData) => {
    let type = { loginType: "API" };
    let channelList = CreatechannelList;
    // const res = await CreateSocketSession(type);

    if (UserDetails.user_id !== undefined && UserDetails.access_token !== undefined) {


        const res = await CreateSocketSession(type, UserDetails.user_id, UserDetails.access_token);

        console.log("res", res.status)
        if (res.status === 200) {
            setSocketState("Ok");
        }
        if (res.status === 401) {
            setSocketState("Unauthorized");

            tradeHistoryData.forEach((row) => {
                calcultateRPL(row, null);
            });
        }
        else {
            if (res.data.stat) {
                const handleResponse = (response) => {
                    // UPL_
                    $(".LivePrice_" + response.tk).html(response.lp);
                    $(".ClosePrice_" + response.tk).html(response.c);


                    var live_price = response.lp === undefined ? "" : response.lp;

                    const get_entry_qty = $(".entry_qty" + response.tk).html();
                    const get_exit_qty = $(".exit_qty" + response.tk).html();
                    const get_exit_price = $(".exit_price" + response.tk).html();
                    const get_entry_price = $(".entry_price" + response.tk).html();
                    const get_entry_type = $(".entry_type" + response.tk).html();
                    const get_exit_type = $(".exit_type" + response.tk).html();

                    //  if entry qty and exist qty both exist
                    if ((get_entry_type === "LE" && get_exit_type === "LX") || (get_entry_type === "SE" && get_exit_type === "SX")) {
                        if (get_entry_qty !== "" && get_exit_qty !== "") {
                            if (parseInt(get_entry_qty) >= parseInt(get_exit_qty)) {
                                let rpl =
                                    (parseInt(get_exit_price) - parseInt(get_entry_price)) *
                                    parseInt(get_exit_qty);
                                let upl = parseInt(get_exit_qty) - parseInt(get_entry_qty);

                                let finalyupl = (parseFloat(get_entry_price) - parseFloat(live_price)) * upl;

                                if ((isNaN(finalyupl) || isNaN(rpl))) {
                                    return "-";
                                } else {
                                    $(".show_rpl_" + response.tk).html(rpl.toFixed(2));
                                    $(".UPL_" + response.tk).html(finalyupl.toFixed(2));
                                    $(".TPL_" + response.tk).html((finalyupl + rpl).toFixed(2));
                                    ShowColor("UPL_", finalyupl.toFixed(2), response.tk);
                                    ShowColor("show_rpl_", rpl.toFixed(2), response.tk);
                                    ShowColor("TPL_", (finalyupl + rpl).toFixed(2), response.tk);
                                }
                            }
                        }
                    }
                    //  if Only entry qty Exist
                    else if ((get_entry_type === "LE" && get_exit_type === "") || (get_entry_type === "SE" && get_exit_type === "")) {
                        let abc = ((parseFloat(live_price) - parseFloat(get_entry_price)) * parseInt(get_entry_qty)).toFixed();
                        if (isNaN(abc)) {
                            return "-";
                        } else {
                            $(".UPL_" + response.tk).html(abc);
                            $(".show_rpl_" + response.tk).html("-");
                            $(".TPL_" + response.tk).html(abc);

                            ShowColor("UPL_", abc, response.tk);
                            ShowColor("show_rpl_", "-", response.tk);
                            ShowColor("TPL_", abc, response.tk);
                        }
                    }

                    //  if Only Exist qty Exist
                    else if (
                        (get_entry_type === "" && get_exit_type === "LX") ||
                        (get_entry_type === "" && get_exit_type === "SX")
                    ) {
                    } else {
                    }
                    // }
                };
                await ConnctSocket(handleResponse, channelList, UserDetails.user_id, UserDetails.access_token).then((res) => { });
            } else {
                $(".UPL_").html("-");
                $(".show_rpl_").html("-");
                $(".TPL_").html("-");
            }
        }
    }




}


const calcultateRPL = (row) => {
    if (row.entry_type !== '' && row.exit_type !== '') {
        if (row.entry_type === "LE" || row.entry_type === "SE") {
            const entryQty = parseInt(row.entry_qty_percent);
            const exitQty = parseInt(row.exit_qty_percent);
            const entryPrice = parseFloat(row.entry_price);
            const exitPrice = parseFloat(row.exit_price);
            const rpl = (exitPrice - entryPrice) * Math.min(entryQty, exitQty);

            $(".show_rpl_" + row.token).html(rpl.toFixed(2));
            $(".TPL_" + row.token).html(rpl.toFixed(2));
            $(".UPL_" + row.token).html("-");

            ShowColor("UPL_", "-", row.token);
            ShowColor("show_rpl_", rpl.toFixed(2), row.token);
            ShowColor("TPL_", rpl.toFixed(2), row.token);
        }

    }
    else if (row.entry_type && row.exit_type === "") {
        $(".show_rpl_" + row.token).html('-');
        $(".TPL_" + row.token).html('-');
        $(".UPL_" + row.token).html("-");
    }
    if (row.entry_type === "" && row.exit_type !== '') {
        $(".show_rpl_" + row.token).html('-');
        $(".TPL_" + row.token).html('-');
        $(".UPL_" + row.token).html("-");
    }
};