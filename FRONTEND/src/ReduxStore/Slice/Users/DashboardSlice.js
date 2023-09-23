import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { USER_DASHBOARD, UPDATE_DAHBOARD_DATA } from "../../../Service/user.service";


export const User_Dashboard_Data = createAsyncThunk("user/dashboard", async (data) => {
    const { user_Id, AdminToken } = data
    console.log(data);
    try {
        const res = await USER_DASHBOARD({ user_Id: user_Id }, AdminToken);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Update_Dashboard_Data = createAsyncThunk("user/dashboard", async (data1) => {
    const { data, AdminToken } = data1
    console.log(data);
    try {
        const res = await UPDATE_DAHBOARD_DATA(data, AdminToken);
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
        update_dashboard: [],
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

        [Update_Dashboard_Data.fulfilled]: (state, { payload }) => {
            return { ...state, update_dashboard: payload, status: false };
        },

    },
});




export default DashboardSlice;
