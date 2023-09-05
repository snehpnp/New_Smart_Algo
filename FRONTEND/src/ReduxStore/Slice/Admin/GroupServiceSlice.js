import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ALL_SERVICES, ADD_GROUP_SERVICES, GET_ALL_SERVICES_NAME, DELETE_GROUP_SERVICES } from "../../../Service/admin.service";



export const Add_Group = createAsyncThunk("admin/add/group", async (data) => {
    try {
        const res = await ADD_GROUP_SERVICES(data);

        return await res;
    } catch (err) {
        return err;
    }
});

export const GET_ALL_SERVICES_NAMES = createAsyncThunk("getall/servicesName", async (data) => {
    try {
        const res = await GET_ALL_SERVICES_NAME(data);

        return await res;
    } catch (err) {
        return err;
    }
});

export const DELETE_GROUP_SERVICE = createAsyncThunk("delete/groupServices", async (data) => {
    try {
        const res = await DELETE_GROUP_SERVICES(data);

        return await res;
    } catch (err) {
        return err;
    }
});

const GroupServiceSlice = createSlice({
    name: "GroupServiceSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        addgroup: [],
        recuders: {},
        AllservicesName: [],
        deletegroupService: [],

        extraReducers: {

            [Add_Group.pending]: (state, action) => {
                console.log("pending Get_All_Service ");
            },
            [Add_Group.fulfilled]: (state, { payload }) => {
                return { ...state, addgroup: payload, isLoading: false };
            },
            [GET_ALL_SERVICES_NAMES.fulfilled]: (state, { payload }) => {
                return { ...state, AllservicesName: payload, isLoading: false };
            },
            [DELETE_GROUP_SERVICE.fulfilled]: (state, { payload }) => {
                return { ...state, deletegroupService: payload, isLoading: false };
            },
        },
    },
});



export default GroupServiceSlice;
