import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ALL_SERVICES, ALL_CATAGORY, SERVICE_BY_CATAGORY,ALL_GROUP_SERVICES ,ALL_CLIENTS,GET_COMPANY_INFO,GET_ALL_TRADINGSTATUS} from "../../../Service/admin.service";



export const Get_All_Service = createAsyncThunk("admin/getallservice", async (data) => {
    try {
        const res = await ALL_SERVICES(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});

export const Get_All_Catagory = createAsyncThunk("admin/getallservice", async (data) => {
    try {
        const res = await ALL_CATAGORY(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Service_By_Catagory = createAsyncThunk("admin/catogory", async (data) => {
    try {
        const res = await SERVICE_BY_CATAGORY(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});

// ADMIN GET ALL CLIENTS
export const GET_ALL_CLIENTS = createAsyncThunk("getall/clients", async (data) => {
    try {
        const res = await ALL_CLIENTS(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});


// ADMIN GET ALL GROUP SERVICES
export const GET_ALL_GROUP_SERVICES = createAsyncThunk("getall/groupservices", async (data) => {
    try {
        const res = await ALL_GROUP_SERVICES(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});

// GET COMPANY INFORMATION
export const GET_COMPANY_INFOS = createAsyncThunk("get/company", async (data) => {
    try {
        const res = await GET_COMPANY_INFO(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});

// GET ALL TRADING STATUS

export const GET_ALL_TRADING_STATUS = createAsyncThunk("getall/tadingstatus", async (data) => {
    try {
        const res = await GET_ALL_TRADINGSTATUS(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
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
        allGroupServices:[],
        allClients:[],
        companyInfo:[],
        getalltradingstatus:[],



    },

    recuders: {},
    extraReducers: {

        [Get_All_Service.pending]: (state, action) => {
            console.log("pending Get_All_Service ");
        },
        [Get_All_Service.fulfilled]: (state, { payload }) => {
            return { ...state, allService: payload, isLoading: false };
        },
        // [Get_All_Service.rejected]: (state, action) => {
        //     console.log("pending reject ");
        //     // return { ...state, allService: action, isLoading: false };
        // },
        [Get_All_Catagory.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, allCatagory: payload, isLoading: false };
        },

        [Service_By_Catagory.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, servicebycatagory: payload, isLoading: false };
        },
        [GET_ALL_GROUP_SERVICES.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, allGroupServices: payload, isLoading: false };
        },
        [GET_ALL_CLIENTS.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, allClients: payload, isLoading: false };
        },
        [GET_COMPANY_INFOS.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, companyInfo: payload, isLoading: false };
        },
        [GET_ALL_TRADING_STATUS.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, getalltradingstatus: payload, isLoading: false };
        },
    },
});


// export const getthemedata = (state) => state && state.ThemeSlice


export default AdminSlice;
