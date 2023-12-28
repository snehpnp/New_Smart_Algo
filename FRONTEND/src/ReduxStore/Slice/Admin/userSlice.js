

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ADD_CLIENT } from "../../../Service/admin.service";



export const Add_User = createAsyncThunk("admin/user/add", async (apireq) => {

    const { req, token } = apireq
    try {
        const res = await ADD_CLIENT(req, token);
        return await res;
    } catch (err) {
        return err;
    }
});



const AdminUserSlice = createSlice({
    name: "AdminUserSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        add_user: [],

    },
    reducers: {}, // Define any reducers here if needed
    extraReducers: {
        [Add_User.fulfilled]: (state, { payload }) => {
            return { ...state, add_user: payload, isLoading: false };
        },
        // [Get_All_Service_for_Client.fulfilled]: (state, { payload }) => {
        //     return { ...state, service_data: payload, isLoading: false };
        //   },
},
});

export default AdminUserSlice;



