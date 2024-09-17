import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ALL_SERVICES, ADD_GROUP_SERVICES, GET_ALL_SERVICES_NAME, UPDATE_SERVICES_BY_GROUP_ID, DELETE_GROUP_SERVICES, GET_ALL_SERVICES_USER_NAME, GET_SERVICES_BY_GROUP_ID, GET_SERVICES_BY_GROUP_ID_For_Edit_update,Addplans,GetAllPlans,GetPlansById,EditPlans } from "../../../Service/admin.service";



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

export const Add_Plans = createAsyncThunk("addplans", async (data) => {
    try {
        const res = await Addplans(data);
        return await res;
    } catch (err) {
        return
    }
});

export const Get_All_Plans = createAsyncThunk("getall/plans", async (data) => {
    try {
        const res = await GetAllPlans(data);
        return await res;
    } catch (err) {
        return
    }
});

export const Get_Plans_By_Id = createAsyncThunk("getplansbyid", async (data) => {
    try {
        const res = await GetPlansById(data);
        return await res;
    } catch (err) {
        return
    }
});

export const Edit_Plans = createAsyncThunk("editplans", async (data) => {
    try {
        const res = await EditPlans(data);
        return await res;
    } catch (err) {
        return
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
        getServiceByGroupId_forEdit: [],
        addplans:[],
        getallplans:[],
        getplansbyid:[],
        editplans:[]
    },
    reducers: {}, 
 
    extraReducers: {
        [Add_Group.fulfilled]: (state, action) => {
       

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
        [Add_Plans.fulfilled]: (state, { payload }) => {
            return { ...state, addplans: payload, isLoading: false };
        },
        [Get_All_Plans.fulfilled]: (state, { payload }) => {
            return { ...state, getallplans: payload, isLoading: false };
        },
        [Get_Plans_By_Id.fulfilled]: (state, { payload }) => {
            return { ...state, getplansbyid: payload, isLoading: false };
        },
        [Edit_Plans.fulfilled]: (state, { payload }) => {
            return { ...state, editplans: payload, isLoading: false };
        },
        

    },
});



export default GroupServiceSlice;
