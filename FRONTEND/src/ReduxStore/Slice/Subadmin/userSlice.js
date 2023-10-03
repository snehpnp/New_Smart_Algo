

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ADD_CLIENT, FIND_ONE_USER, DELETE_USERAND_ALLSERVICES, UPDATE_USER, GETALL_SUB_ADMINS_CLIENTS } from "../../../Service/subadmin.service";



export const Add_User = createAsyncThunk("admin/user/add", async (apireq) => {

    const { req, token } = apireq
    try {
        const res = await ADD_CLIENT(req, token);

        return await res;
    } catch (err) {
        return err;
    }
});


// UPDATE USER ACTIVE STATUS FOR API
export const Find_One_User = createAsyncThunk("update/useractive/status", async (data) => {
    try {
        const { id } = data
        const res = await FIND_ONE_USER({ id: id });
        // console.log("res" ,res);
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
        // console.log("res" ,res);
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
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        console.log("err", err);
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



const AdminUserSlice = createSlice({
    name: "AdminUserSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        add_user: [],
        allSubadminClients: [],
        deleteuser: [],
        updateuser: [],
        oneuser: [],

        allClients: [],


    },
    reducers: {}, // Define any reducers here if needed
    extraReducers: {
        [Add_User.fulfilled]: (state, { payload }) => {
            return { ...state, add_user: payload, isLoading: false };
        },
        [Find_One_User.fulfilled]: (state, { payload }) => {
            return { ...state, oneuser: payload, isLoading: false };
        },
        [Update_User.fulfilled]: (state, { payload }) => {
            return { ...state, updateuser: payload, isLoading: false };
        },
        [DELETE_USER_SERVICES.fulfilled]: (state, { payload }) => {
            return { ...state, deleteuser: payload, isLoading: false };
        },
        [Get_All_SUBADMIN_CLIENT.fulfilled]: (state, { payload }) => {
            return { ...state, allClients: payload, isLoading: false };
        },
    },
});

export default AdminUserSlice;



