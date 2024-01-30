import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GETALL_SUB_ADMINS,GETALL_SUB_ADMINS_CLIENTS  , GET_SUB_ADMINS_PERMISSIONS} from "../../../Service/subadmin.service";



export const Get_All_SUBADMIN = createAsyncThunk("getall/subadmin", async (data) => {
    try {
        const res = await GETALL_SUB_ADMINS(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});


export const Get_All_SUBADMIN_CLIENT = createAsyncThunk("getall/subadmin", async (data) => {
    try {
        const res = await GETALL_SUB_ADMINS_CLIENTS(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Get_Sub_Admin_Permissions = createAsyncThunk("subadmin/permissions", async (data) => {
    try {
        const res = await GET_SUB_ADMINS_PERMISSIONS(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});

const SubadminSlice = createSlice({
    name: "SubadminsSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        allSubadmin: [],
        allSubadminClients: [],
        allpermissions: [],


    },

    recuders: {},
    extraReducers: {

        [Get_All_SUBADMIN.pending]: (state, { payload }) => {
            // state.isLoading = false;
             
            // return { ...state, allService: [], isLoading: true };
        },
        [Get_All_SUBADMIN.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;

            return { ...state, allSubadmin: payload, isLoading: false };
        },
        [Get_All_SUBADMIN.rejected]: (state, action) => {
            console.log("pending reject ");
            // return { ...state, allService: action, isLoading: false };
        },
        [Get_All_SUBADMIN_CLIENT.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, allSubadminClients: payload, isLoading: false };
        },
        [Get_Sub_Admin_Permissions.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, allpermissions: payload, isLoading: false };
        },

    },
});


// export const getthemedata = (state) => state && state.ThemeSlice


export default SubadminSlice;
