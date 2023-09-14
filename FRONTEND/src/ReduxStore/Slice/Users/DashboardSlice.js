import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { USER_DASHBOARD } from "../../../Service/user.service";


export const User_Dashboard_Data = createAsyncThunk("user/dashboard", async (data) => {
    const { user_Id, AdminToken } = data
    console.log(data) ;
    try {
        const res = await USER_DASHBOARD({ user_Id: user_Id} , AdminToken );
        return await res;
    } catch (err) {
        return err;
    }
});

const DashboardSlice = createSlice({
    name: "DashboardSlice",
    initialState: {
        isLoading: false,
        isError: false,
        get_dashboard: [],
        gettheme: [],
        status: false
    },

    recuders: {},
    extraReducers: {

        [User_Dashboard_Data.pending]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, get_dashboard: [], isLoading: true };
        },
        [User_Dashboard_Data.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, get_dashboard: payload, isLoading: false };
        },
        [User_Dashboard_Data.rejected]: (state, action) => {
            return { ...state, get_dashboard: action, isLoading: false };
        },
        // [Get_All_Theme.pending]: (state, action) => {
        //     return { ...state, gettheme: [], isLoading: true };
        // },
        // [Get_All_Theme.fulfilled]: (state, { payload }) => {
        //     console.log("payload", payload);
        //     return { ...state, gettheme: payload, status: false };
        // },
        // [Get_All_Theme.rejected]: (state, action) => {
        //     return { ...state, gettheme: action, status: false };

        // },
    },
});




export default DashboardSlice;
