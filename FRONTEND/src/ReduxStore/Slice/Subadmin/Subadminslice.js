import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GETALL_SUB_ADMINS } from "../../../Service/subadmin.service";



export const Get_All_SUBADMIN = createAsyncThunk("getall/subadmin", async (data) => {
    try {
        const res = await GETALL_SUB_ADMINS(data);
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
        
    },

    recuders: {},
    extraReducers: {

        [Get_All_SUBADMIN.pending]: (state, { payload }) => {
            // state.isLoading = false;
            console.log("pending Get_All_SUBADMIN ");
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
    
    },
});


// export const getthemedata = (state) => state && state.ThemeSlice


export default SubadminSlice;
