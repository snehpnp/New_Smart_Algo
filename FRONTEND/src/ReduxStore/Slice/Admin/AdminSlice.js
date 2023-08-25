import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ALL_SERVICES, ALL_CATAGORY, SERVICE_BY_CATAGORY,ALL_GROUP_SERVICES ,ALL_CLIENTS} from "../../../Service/admin.service";



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
        allClients:[]

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
    },
});


// export const getthemedata = (state) => state && state.ThemeSlice


export default AdminSlice;
