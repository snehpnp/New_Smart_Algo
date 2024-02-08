
//  1= Market Hub, 2=  'Alice Blue, 3= Master Trust , 4 = Motilal Oswal, 5=Zebull ,
//  6=IIFl , 7=Kotak , 8=Mandot , 9=Choice, 10=Anand Rathi, 11=B2C, 13=Angel,
// 13 =Fyers , 14 = 5-Paisa , 15 Zerodha ,
import * as Config from "../../../Utils/Config";
//import * as Config from "../Utils/Config";
import { GET_BROKER_INFORMATION } from "../../../Service/admin.service";


export const loginWithApi = async (broker_id, UserDetails) => {

    if (broker_id === "1" || broker_id === 1) {
        alert("broker-1")
    }
    else if (broker_id === "2" || broker_id === 2) {   
        const res = await GET_BROKER_INFORMATION();
        window.location.href = `https://ant.aliceblueonline.com/?appcode=${res.data[0].app_code}`;
    }
    else if (broker_id === "3" || broker_id === 3) {
        alert("broker-3")
    }
    else if (broker_id === "4" || broker_id === 4) {
        alert("broker-4")
    }
    else if (broker_id === "5" || broker_id === 5) {
        alert("broker-5")
    }
    else if (broker_id === "6" || broker_id === 6) {
        alert("broker-6")
    }
    else if (broker_id === "7" || broker_id === 7) {
        alert("broker-7")
    }
    if (broker_id === "8" || broker_id === 8) {
        alert("broker-8")
    }
    else if (broker_id === "9" || broker_id === 9) {
        alert("broker-9")
    }
    else if (broker_id === "10" || broker_id === 10) {
        alert("broker-10")
    }
    else if (broker_id === "11" || broker_id === 11) {
        alert("broker-11")
    }

    else if (broker_id === "12" || broker_id === 12) {
        // console.log("UserDetails",UserDetails.api_key)
        // alert("broker-12")
        window.location.href = "https://smartapi.angelbroking.com/publisher-login?api_key=" + UserDetails.api_key;
        // alert(UserDetails.api_key)
    }

    else if (broker_id === "13" || broker_id === 13) {
        alert("broker-13")
    }

    // FIVE PAISA
    else if (broker_id === "14" || broker_id === 14) {

        window.location.href = `https://dev-openapi.5paisa.com/WebVendorLogin/VLogin/Index?VendorKey=${UserDetails.api_key}&ResponseURL=${Config.base_url}fivepaisa&State=${UserDetails.client_key}`;


        //alert(`https://dev-openapi.5paisa.com/WebVendorLogin/VLogin/Index?VendorKey=${UserDetails.api_key}&ResponseURL=${Config.base_url}fivepaisa&State=${UserDetails.client_key}`)


    }
    else if (broker_id === "15" || broker_id === 15) {
        window.location.href = "https://kite.zerodha.com/connect/login?v=3&api_key=" + UserDetails.api_key;
        // alert("broker-15")
    }
    else if (broker_id === "16" || broker_id === 16) {
        alert("broker-16")
    }
    else if (broker_id === "17" || broker_id === 17) {
        alert("broker-17")
    }
    else if (broker_id === "19" || broker_id === 19) {
        //alert("broker-19")

        window.location.href = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${UserDetails.api_key}&redirect_uri=${Config.base_url}upstox&state=${UserDetails.Email}`


    }
    else if (broker_id === "20" || broker_id === 20) {
        alert("broker-20")
    }
    else if (broker_id === "21" || broker_id === 21) {
        alert("broker-21")
    }
    else if (broker_id === "22" || broker_id === 22) {
        alert("broker-22")
    }


}