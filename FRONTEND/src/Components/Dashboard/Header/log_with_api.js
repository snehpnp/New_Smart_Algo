
//  1= Market Hub, 2=  'Alice Blue, 3= Master Trust , 4 = Motilal Oswal, 5=Zebull ,
//  6=IIFl , 7=Kotak , 8=Mandot , 9=Choice, 10=Anand Rathi, 11=B2C, 13=Angel,
// 13 =Fyers , 14 = 5-Paisa , 15 Zerodha ,
import * as Config from "../../../Utils/Config";
import axios from "axios";
import { GET_BROKER_INFORMATION } from "../../../Service/admin.service";
import toast, { Toaster } from 'react-hot-toast';

import ToastButton from "../../ExtraComponents/Alert_Toast";
import Shoonya from "./Brokerpage/Shoonya";


export const loginWithApi = async (broker_id, UserDetails,check) => {

    if (broker_id === "1" || broker_id === 1) {

        axios({
            url: `${Config.base_url}markethub`,
            method: "post",
            data: {
                Email: UserDetails.Email,
            },
        }).then((res) => {
         
            if (res.data.status == true) {
                toast.success(res.data.msg)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);

            } else {
                toast.error(res.data.msg)

            }

        });

    }
    else if (broker_id === "2" || broker_id === 2) {
        const res = await GET_BROKER_INFORMATION();
        window.location.href = `https://ant.aliceblueonline.com/?appcode=${res.data[0].app_code}`;
    }
    else if (broker_id === "3" || broker_id === 3) {
      
        window.location.href = `https://masterswift-beta.mastertrust.co.in/oauth2/auth?scope=orders%20holdings&state=${UserDetails.Email}&redirect_uri=${Config.base_url}mastertrust&response_type=code&client_id=${UserDetails.app_id}`;

    }
    else if (broker_id === "4" || broker_id === 4) {
        window.location.href = `https://invest.motilaloswal.com/OpenAPI/Login.aspx?apikey=${UserDetails.api_key}`;
    }
    else if (broker_id === "5" || broker_id === 5) {
        axios({
            url: `${Config.base_url}zebu`,
            method: "post",
            data: UserDetails,
        }).then((res) => {
            if (res.data.status == true) {
                toast.success(res.data.msg)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error(res.data.msg)
            }
        });
    }
    else if (broker_id === "6" || broker_id === 6) {
    
    }
    else if (broker_id === "7" || broker_id === 7) {

        axios({
            url: `${Config.base_url}kotakGetToken`,
            method: "post",
            data: {
                Email: UserDetails.Email,
            },
        }).then((res) => {
       
            if (res.data.status == true) {
                let value = prompt("Enter Your OTP Here");
                if (value === null) {
                    return;
                }
                axios({
                    url: `${Config.base_url}kotakGetSession`,
                    method: "post",
                    data: {
                        Email: UserDetails.Email,
                        otp: value,
                    },
                }).then((res) => {
                    if (res.data.status == true) {
                        toast.success(res.data.msg)
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);

                    }
                    else if (res.data.status == false) {
                        toast.error(res.data.msg)

                    }
                });
            } else if (res.data.status == false) {
                toast.error(res.data.msg)
            }
        })


    }
    if (broker_id === "8" || broker_id === 8) {
        axios({
            url: `${Config.base_url}mandotsecurities`,
            method: "post",
            data: {
                Email: UserDetails.Email,
                _id: UserDetails._id,
                system_ip:""

            },
        }).then((res) => {
            if (res.data.status == true) {
                toast.success(res.data.msg)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);

            } else {
                toast.error(res.data.msg)

            }

        });
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
       
  
        window.location.href = "https://smartapi.angelbroking.com/publisher-login?api_key=" + UserDetails.api_key;
       
    }
    else if (broker_id === "13" || broker_id === 13) {

        window.location.href = `https://api.fyers.in/api/v2/generate-authcode?client_id=${UserDetails.app_id}&redirect_uri=${Config.base_url}fyers&response_type=code&state=${UserDetails.client_key}`
       
    }
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

        axios({
            url: `${Config.base_url}dhan`,
            method: "post",
            data: {
                Email: UserDetails.Email,
            },
        }).then((res) => {
         
            if (res.data.status == true) {

                toast.success(res.data.msg)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error(res.data.msg)
            }

        });

    }
    else if (broker_id === "21" || broker_id === 21) {
    
        var totp = prompt("Enter TOTP")
    

        axios({
            url: `${Config.base_url}swastika`,
            method: "post",
            data: {
                Email: UserDetails.Email,
                totp: totp
            },
        }).then((res) => {
      
            if (res.data.status == true) {
                toast.success(res.data.msg)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error(res.data.msg)

            }

        });
    }
    else if (broker_id === "22" || broker_id === 22) {
        alert("broker-22")
    }
    else if (broker_id === "25" || broker_id === 25) {


        const encodedApiKey = encodeURIComponent(UserDetails.api_key);
               
        window.location.href = `https://api.icicidirect.com/apiuser/login?api_key=${encodedApiKey}`;
        
        }
    else if (broker_id === "26" || broker_id === 26) {

        axios({
            url: `${Config.base_url}iiflsecurities`,
            method: "post",
            data: { Email: UserDetails.Email },

        }).then((res) => {
            if (res.data.status == true) {
                toast.success(res.data.msg)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error(res.data.msg)

            }

        });;

    }
    else if (broker_id === "27" || broker_id === 27) {
        // THIS PAGE OPEN A MODAL THIS MODAL FULL PAGEMODAL AND A FORM INSIDE IT CODE 
   
        axios({
            url: `${Config.base_url}shoonya`,
            method: "post",
            data: {
                Email: UserDetails.Email,
                _id: UserDetails._id,
                system_ip:""

            },
        }).then((res) => {

           
            if (res.data.status) {
                toast.success(res.data.msg)
                setTimeout(() => {
                    window.location.reload();
                }, 1100);

            } else {
                toast.error(res.data.msg)

            }

        });

    }

    <ToastButton />
}