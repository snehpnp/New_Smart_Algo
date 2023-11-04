import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ALL_SERVICES, ADD_GROUP_SERVICES, GET_ALL_SERVICES_NAME, UPDATE_SERVICES_BY_GROUP_ID, DELETE_GROUP_SERVICES, GET_ALL_SERVICES_USER_NAME, GET_SERVICES_BY_GROUP_ID, GET_SERVICES_BY_GROUP_ID_For_Edit_update } from "../../../Service/admin.service";



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

export const GET_ALL_SERVICES_USER_NAMES = createAsyncThunk("getall/services/username", async (data) => {
    try {
        const res = await GET_ALL_SERVICES_USER_NAME(data);

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

export const Get_Service_By_Group_Id = createAsyncThunk("service/byid", async (data) => {
    try {
        const res = await GET_SERVICES_BY_GROUP_ID(data);

        return await res;
    } catch (err) {
        return err;
    }
});
export const Get_Service_By_Group_Id_For_Edit_Update = createAsyncThunk("service/byid1", async (data) => {
    try {
        const res = await GET_SERVICES_BY_GROUP_ID_For_Edit_update(data);

        return await res;
    } catch (err) {
        return err;
    }
});

export const Update_Service_By_Group_Id = createAsyncThunk("service/byid", async (data) => {
    try {
        const res = await UPDATE_SERVICES_BY_GROUP_ID(data);

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
        AllservicesName: [],
        deletegroupService: [],
        AllservicesuserName: [],
        getServiceByGroupId: [],
        updatServiceByGroupId: [],
        getServiceByGroupId_forEdit: []
    },
    reducers: {}, // Reducers should be defined here, if you have any
    // extraReducers: (builder) => { // Define extra reducers using builder
    //     builder
    //         .addCase(Add_Group.pending, (state, action) => {
    //             console.log("pending Add_Group");
    //             state.isLoading = true;
    //         })
    //         .addCase(Add_Group.fulfilled, (state, action) => {
    //             state.addgroup = action.payload;
    //             state.isLoading = false;
    //         })
    //         .addCase(GET_ALL_SERVICES_NAMES.fulfilled, (state, action) => {
    //             state.AllservicesName = action.payload;
    //             state.isLoading = false;
    //         })
    //         .addCase(GET_ALL_SERVICES_USER_NAMES.fulfilled, (state, action) => {
    //             state.AllservicesuserName = action.payload;
    //             state.isLoading = false;
    //         })
    //         .addCase(DELETE_GROUP_SERVICE.fulfilled, (state, action) => {
    //             state.deletegroupService = action.payload;
    //             state.isLoading = false;
    //         });
    // },

    extraReducers: {
        [Add_Group.fulfilled]: (state, action) => {
            // return { ...state, add_user: payload, isLoading: false };
            console.log("pending Add_Group");

        },
        [Add_Group.fulfilled]: (state, { payload }) => {
            return { ...state, addgroup: payload, isLoading: false };
        },
        [GET_ALL_SERVICES_NAMES.fulfilled]: (state, { payload }) => {
            return { ...state, AllservicesName: payload, isLoading: false };
        },
        [GET_ALL_SERVICES_USER_NAMES.fulfilled]: (state, { payload }) => {
            return { ...state, AllservicesuserName: payload, isLoading: false };
        },
        [DELETE_GROUP_SERVICE.fulfilled]: (state, { payload }) => {
            return { ...state, deletegroupService: payload, isLoading: false };
        },
        [Update_Service_By_Group_Id.fulfilled]: (state, { payload }) => {
            return { ...state, updatServiceByGroupId: payload, isLoading: false };
        },
        [Get_Service_By_Group_Id.fulfilled]: (state, { payload }) => {
            return { ...state, getServiceByGroupId: payload, isLoading: false };
        },
        [Get_Service_By_Group_Id_For_Edit_Update.fulfilled]: (state, { payload }) => {
            return { ...state, getServiceByGroupId_forEdit: payload, isLoading: false };
        },

    },
});



export default GroupServiceSlice;
