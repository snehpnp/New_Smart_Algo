import axios from "axios";
import * as Config from "../Utils/Config";
import { header } from "../Utils/ApiHeader";


// ALL CLIENTS
export async function ALL_CLIENTS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/clients`, data)
        return await res?.data;
    }
    catch (err) {

    }

}

// ALL SIGNUP CLIENTS
export async function ALL_SIGNUP_CLIENTS(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}showuserdata`, data, {
            headers: header(token),
            data: {

                "page": "5",
                "limit": "1"

            },
        })
        return await res?.data;
    }
    catch (err) {

    }

}




// ALL CLIENTS
export async function ALL_EXPIRED_CLIENTS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/expiredclients`, data, {
            headers: header(token),
            data: {

                "page": "5",
                "limit": "1"

            },
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// FIND ONE CLIENT BY ID
export async function FIND_ONE_USER(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/userinfo`, data, {
            headers: header(token),

        })
        return await res?.data;
    }
    catch (err) {

    }

}


// FIND ONE SIGNUP CLIENT BY ID
export async function FIND_ONE_CLIENT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/userinfo`, data, {
            headers: header(token),

        })
        return await res?.data;
    }
    catch (err) {

    }

}



// UPDATE CLIENT BY ID
export async function UPDATE_USER(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/employee`, data, {
            headers: header(token),

        })
        return await res?.data;
    }
    catch (err) {

    }

}

export async function FIND_ONE_SIGNUP_CLIENT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/employee`, data, {
            headers: header(token),

        })
        return await res?.data;
    }
    catch (err) {

    }

}


// ALL SERVICES
export async function ALL_SERVICES(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}getAllService`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// ALL SERVICES
export async function GET_COMPANY_LOGO(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}get/company_logo`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// ALL CATAGORY
export async function ALL_CATAGORY(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}allCatagory`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// ALL SERVICE_BY_CATAGORY
export async function SERVICE_BY_CATAGORY(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}ServiceByCatagory`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// ALL ALL_GROUP_SERVICES
export async function ALL_GROUP_SERVICES(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/groupservices`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// GET COMPNAY INFORMATION
export async function GET_COMPANY_INFO(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}get/company`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// ALL ADD_GROUP_SERVICES
export async function ADD_GROUP_SERVICES(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}addgroupservice`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

// ALL GET_ALL_STRATEGY
export async function GET_ALL_STRATEGY(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/strategy`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// ALL GET_STRATEGY_BY_ID
export async function GET_STRATEGY_BY_ID(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/strategy`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

    }

}

// EDIT_STRATEGY_BY_ID
export async function EDIT_STRATEGY_BY_ID(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}edit/strategy`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// ALL REMOVE_STRATEGY_BY_ID
export async function REMOVE_STRATEGY_BY_ID(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}delete/strategy`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// ALL ADD_STRATEGY
export async function ADD_STRATEGY(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}add/strategy`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// GET ALL TRADING STATUS
export async function GET_ALL_TRADINGSTATUS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/tadingstatus`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

// GET ALL TRADING STATUS
export async function GO_TO_DASHBOARD(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}goToDashboard`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

    }

}

// GET ALL SERVICES NAMES
export async function GET_ALL_SERVICES_NAME(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/servicesName`, data, {
            //  headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

    }

}

// GET ALL SERVICES NAMES
export async function GET_ALL_SERVICES_USER_NAME(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/services/username`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}




// GET SERVICES BY GROUP ID --- for preview any were 
export async function GET_SERVICES_BY_GROUP_ID(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/services/bygroupid`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

// GET SERVICES BY GROUP ID  --- for edit and update Only
export async function GET_SERVICES_BY_GROUP_ID_For_Edit_update(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/services/bygroupid1`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}



// UPDATE SERVICES BY GROUP ID
export async function UPDATE_SERVICES_BY_GROUP_ID(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}edit/groupservice`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}
// GET CLIENTS BY STRATEG ID
export async function GET_CLIENTS_BY_STRATEG_ID(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/strategy/client`, data, {
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// DELETE GROUP SERVICES
export async function DELETE_GROUP_SERVICES(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}delete/groupServices`, data, {
            //  headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// UPDATE ACTIVE STATUS
export async function UPDATE_USERACTIVE_STATUS(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}update/useractive/status`, data, {
            //  headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

    }

}



// ADD USER
export async function ADD_CLIENT(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}add/employee`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

        return err
        // custom error
    }

}


// GET ALL SERVICE
export async function GET_ALL_SERVICE(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}get/allsignals`, data, {
            headers: header(token),
            data: { data },
        })


        return await res?.data;
    }
    catch (err) {

        return err
        // custom error
    }

}

// GET TRADEHISTORY
export async function GET_TRADEHISTORY(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/tradhistory`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

        return err
        // custom error
    }

}

// GET Holdigs
export async function GETHOLDINGS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/holdings/admin`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

        return err
        // custom error
    }

}


export async function GET_TRADEHISTORY_cal(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/tradhistory/cal`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

        return err
        // custom error
    }

}

// GET TRADEHISTORY
export async function GET_TRADEHISTORY1(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/tradhistory1`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

        return err
        // custom error
    }

}


// GET 7 Day TRADEHISTORY
export async function GET_SEVAN_TRADEHISTORY(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}get/entry/tradhistory`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {

        return err
        // custom error
    }

}

// DELTE USER
export async function DELETE_USERAND_ALLSERVICES(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}delete/user`, data, {
            //  headers: header(token),
            data: { data },
        })
        return await res?.data;

    }
    catch (err) {

        return err
        // custom error
    }

}


// DELETE ALL SIGNUP CLIENT
export async function DELETE_ALL_SIGNUP_CLIENT(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}deletesignupclients`, data, {
            //  headers: header(token),
            data: { data },
        })
        return await res?.data;

    }
    catch (err) {

        return err
        // custom error
    }

}




// GET DASHBOARD COUNT
export async function GET_DASHBOARD_COUNT(token) {
    let data = {}
    try {
        const res = await axios.post(`${Config.base_url}get/dashboard/count`, data, {
            headers: header(token),
            data: {},

        })
        return await res?.data;
    }
    catch (err) {


        return err
        // custom error
    }

}


// GET_HELP_REQUEST
export async function GET_HELP_REQUEST(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}getall/helps`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

        return err
        // custom error
    }

}




// EXPIRED_SOO_USER
export async function EXPIRED_SOON_USER(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}getall/expired/user`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

        return err
        // custom error
    }

}



// TRANSACTION_LICENCE
export async function TRANSACTION_LICENCE(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}getall/transection/license`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

        return err
        // custom error
    }

}
// ADD SUBADMIN
export async function ADD_SUBADMIN(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}add/subadmin`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

// EDIT SUBADMIN
export async function EDIT_SUBADMIN(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}edit/subadmin`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}
// EDIT ONE SUBADMIN
export async function FIND_ONE_SUBADMIN(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/subadmin`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}
//  -----------------------   update system



// UPDATE_SMTP_DETAILS
export async function UPDATE_SMTP_DETAILS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}edit/emailinfo`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

// UPDATE_COMPANY_DETAILS
export async function UPDATE_COMPANY_DETAILS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}edit/company`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}



// GET_CLIENT_BY_SUBADMIN_ID

export async function GET_CLIENT_BY_SUBADMIN_ID(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}sub/get/clientbyId`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}




// UPDATE CLIENT BY ID
export async function SUBADMIN_UPDATE_USER_STATUS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}sub/update/useractive/status`, data, {
            headers: header(token),

        })
        return await res?.data;
    }
    catch (err) {

    }

}


// GET BROKER RESPONSE
export async function GET_BROKER_INFORMATION(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/broker_information`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {

    }

}
// GET BROKER RESPONSE
export async function UPDATE_BROKER_INFORMATION(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/broker_information`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {

    }

}



// MESSAGE BROADCAST

export async function ADD_MESSAGE_BROADCAST(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}add/messagebrodcast`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {

    }

}
// All MESSAGE BROADCAST

export async function GET_ALL_MESSAGE_BROADCAST(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/messagebrodcast`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {

    }

}
// All MESSAGE BROADCAST

export async function REMOVE_MESSAGE_BROADCAST(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}remove/messagebrodcast`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// FIND BROKER RESPONSE BY ID
export async function FIND_BROKER_RESPONSE(data) {
    try {
        const res = await axios.post(`${Config.base_url}get/broker_information`, data, {
            // headers: header(token),

        })
        return await res?.data;
    }
    catch (err) {

    }

}


// ADMIN TRADING STATUS GET
export async function GET_ADMIN_TRADING_STATUS(data) {
    try {
        const res = await axios.post(`${Config.base_url}admin/trading/status`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

// ADD AND REMOVE STRATEGY TO CLIENT
export async function AddAndRemoveStrategyToClient(data) {
    try {
        const res = await axios.post(`${Config.base_url}get/add_remove_client_strategy`, data, {
            // headers: header(token),
            data: {},
        })


        return await res?.data;
    }
    catch (err) {

    }

}

//UPDATE STRATEGY TO CLIENT
export async function UpdateStrategyToClient(data) {
    try {
        const res = await axios.post(`${Config.base_url}get/update_add_remove_client_strategy`, data, {
            // headers: header(token),
            data: {},
        })


        return await res?.data;
    }
    catch (err) {

    }

}

//UPDATE STRATEGY TO CLIENT
export async function DISCLAIMER_MESSAGE(data) {
    try {
        const res = await axios.post(`${Config.base_url}update/disclaimer`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }
}

export async function DawnloadData(user_id, token) {
    try {
        const res = await axios.post(`${Config.base_url}dawnload/data`, user_id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}


// GET ALL STAR CLIENTS
export async function GetAllStarClients(user_id, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/star/clients`, user_id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}


// Update STAR CLIENTS Status
export async function UpdateStarStatus(user_id, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/star/status`, user_id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}



export async function GetAllReferalUser(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/referaluser`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}





export async function AdminTradingStatusGet(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/trading/status/get`, data,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}



export async function Addplans(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}addplans`, data,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}


export async function GetAllPlans(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}getallplans`, data,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}

export async function GetPlansById(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getplansbyid`, data,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}

export async function EditPlans(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}editplans`, data,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}

export async function GetLastUserName() {
    try {
        const res = await axios.get(`${Config.base_url}get/last/username`,{
            
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}

// DELETE PLANS
export async function DeletePlans(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}deleteplans`, data,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}

export async function GetSignalsAdmin(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/signals/admin`, data,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}


export async function UpdatePricePermission(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/pricepermission`, data,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}

export async function pnlpositionUpdate(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/pnlposition`, data,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}

export async function GetPnlPostion(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}get/pnlposition`, data,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }
}