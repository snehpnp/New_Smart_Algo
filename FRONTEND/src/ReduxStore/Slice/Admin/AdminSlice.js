import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ALL_SERVICES, ALL_CATAGORY, ALL_SIGNUP_CLIENTS, SERVICE_BY_CATAGORY, ALL_GROUP_SERVICES, ALL_EXPIRED_CLIENTS, ALL_CLIENTS, GET_COMPANY_LOGO, GET_COMPANY_INFO, GET_ALL_TRADINGSTATUS, GO_TO_DASHBOARD, UPDATE_USERACTIVE_STATUS, DELETE_ALL_SIGNUP_CLIENT, DELETE_USERAND_ALLSERVICES , FIND_ONE_USER, UPDATE_USER, FIND_ONE_SIGNUP_CLIENT } from "../../../Service/admin.service";



export const Get_All_Service = createAsyncThunk("admin/getallservice", async (data) => {
    try {
        const res = await ALL_SERVICES(data);
       
        return await res;
    } catch (err) {
        return err;
    }
});

export const Get_All_Catagory = createAsyncThunk("admin/catagory", async (data) => {
    try {
        const res = await ALL_CATAGORY(data);
        
        return await res;
    } catch (err) {
        return err;
    }
});
export const Service_By_Catagory = createAsyncThunk("admin/catogory", async (data) => {
    try {
        const res = await SERVICE_BY_CATAGORY(data);
        
        return await res;
    } catch (err) {
        return err;
    }
});

// ADMIN GET ALL CLIENTS
export const GET_ALL_CLIENTS = createAsyncThunk("getall/clients", async (data) => {
    try {
        const res = await ALL_CLIENTS(data);
     
        return await res;
    } catch (err) {
        return err;
    }
});


//ADMIN GET ALL SIGNUP CLIENT

export const GET_ALL_SIGNUP_CLIENTS = createAsyncThunk("showuserdata", async (data) => {
    try {
        const res = await ALL_SIGNUP_CLIENTS(data);
      
        return await res;
    } catch (err) {
        return err;
    }
});

// ADMIN GET ALL CLIENTS
export const GET_ALL_EXPIRED_CLIENTS = createAsyncThunk("getall/clients", async (data) => {
    try {
        const res = await ALL_EXPIRED_CLIENTS(data);
       
        return await res;
    } catch (err) {
        return err;
    }
});


// ADMIN GET ALL GROUP SERVICES
export const GET_ALL_GROUP_SERVICES = createAsyncThunk("getall/groupservices", async (data) => {
    try {
        const res = await ALL_GROUP_SERVICES(data);
    
        return await res;
    } catch (err) {
        return err;
    }
});

// GET COMPANY INFORMATION
export const GET_COMPANY_INFOS = createAsyncThunk("get/company", async (data) => {
    try {
        const res = await GET_COMPANY_INFO(data);
      
        return await res;
    } catch (err) {
        return err;
    }
});
// GET COMPANY INFORMATION
export const Get_Company_Logo = createAsyncThunk("get/company", async (data) => {
    try {
        const res = await GET_COMPANY_LOGO(data);
       
        return await res;
    } catch (err) {
        return err;
    }
});

// GET ALL TRADING STATUS
export const GET_ALL_TRADING_STATUS = createAsyncThunk("getall/tadingstatus", async (data) => {
    try {
        const res = await GET_ALL_TRADINGSTATUS(data);
       
        return await res;
    } catch (err) {
        return err;
    }
});



// GET ALL TRADING STATUS
export const GO_TO_DASHBOARDS = createAsyncThunk("goToDashboard", async (data) => {
    try {
        const res = await GO_TO_DASHBOARD(data);
        
        return await res;
    } catch (err) {
        return err;
    }
});



// UPDATE USER ACTIVE STATUS FOR API
export const UPDATE_USER_ACTIVE_STATUS = createAsyncThunk("update/useractive/status", async (data) => {
    try {
        const res = await UPDATE_USERACTIVE_STATUS(data);
    
        return await res;
    } catch (err) {
        console.log("err", err);
        return err;
    }
});


// UPDATE USER ACTIVE STATUS FOR API
export const Find_One_User = createAsyncThunk("update/useractive/status", async (data) => {
    try {
        const { id } = data
        const res = await FIND_ONE_USER({ id: id });
     
        return await res;
    } catch (err) {
        console.log("err", err);
        return err;
    }
});

export const Find_One_Signup_Client = createAsyncThunk("update/useractive/status", async (data) => {
    try {
        const { id } = data
        const res = await FIND_ONE_SIGNUP_CLIENT({ id: id });
     
        return await res;
    } catch (err) {
        console.log("err", err);
        return err;
    }
});

// UPDATE USER ACTIVE STATUS FOR API
export const Update_User = createAsyncThunk("update/useractive/status", async (data) => {
    try {
        const { req, token } = data
        const res = await UPDATE_USER({ req: req }, token);
        
        return await res;
    } catch (err) {
        console.log("err", err);
        return err;
    }
});



// DELETE API TO DELTE USER AND HIS ALL TYPE OF SERVICES
export const DELETE_USER_SERVICES = createAsyncThunk("delete/user", async (data) => {
    try {
        const res = await DELETE_USERAND_ALLSERVICES(data);
      
        return await res;
    } catch (err) {
        console.log("err", err);
        return err;
    }
});

// DELETE SIGNUP CLIENT
export const DELETE_ALL_SIGNUP = createAsyncThunk("deletesignupclients", async (data) => {
    try {
        const res = await DELETE_ALL_SIGNUP_CLIENT(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        console.log("err", err);
        return err;
    }
});

const AdminSlice = createSlice({
    name: "AdminSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        allService: [],
        allCatagory: [],
        servicebycatagory: [],
        allGroupServices: [],
        allClients: [],
        allExpiredClients: [],
        companyInfo: [],
        getalltradingstatus: [],
        goTodashboard: [],
        activeStatus: [],
        deleteuser: [],
        updateuser: [],
        oneuser: [],
        logos: []
    },

    recuders: {},
    extraReducers: {

        // [Get_All_Service.pending]: (state, action) => {
        
        // },
        [Get_All_Service.fulfilled]: (state, { payload }) => {
            return { ...state, allService: payload, isLoading: false };
        },

        [Get_All_Catagory.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, allCatagory: payload, isLoading: false };
        },

        [Service_By_Catagory.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, servicebycatagory: payload, isLoading: false };
        },
        [Find_One_User.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, oneuser: payload, isLoading: false };
        },
        [GET_ALL_GROUP_SERVICES.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, allGroupServices: payload, isLoading: false };
        },
        [GET_ALL_CLIENTS.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, allClients: payload, isLoading: false };
        },
        [GET_ALL_EXPIRED_CLIENTS.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, allExpiredClients: payload, isLoading: false };
        },
        [GET_COMPANY_INFOS.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, companyInfo: payload, isLoading: false };
        },
        [Get_Company_Logo.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, logos: payload, isLoading: false };
        },
        [GET_ALL_TRADING_STATUS.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, getalltradingstatus: payload, isLoading: false };
        },
        [GO_TO_DASHBOARDS.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, goTodashboard: payload, isLoading: false };
        },
        [UPDATE_USER_ACTIVE_STATUS.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, activeStatus: payload, isLoading: false };
        },
         
        [Update_User.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, updateuser: payload, isLoading: false };
        },
        [DELETE_USER_SERVICES.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, deleteuser: payload, isLoading: false };
        },
    },
});


// export const getthemedata = (state) => state && state.ThemeSlice


export default AdminSlice;
