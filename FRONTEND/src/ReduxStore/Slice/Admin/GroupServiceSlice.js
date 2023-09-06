import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ALL_SERVICES, ADD_GROUP_SERVICES, GET_ALL_SERVICES_NAME, DELETE_GROUP_SERVICES ,GET_ALL_SERVICES_USER_NAME} from "../../../Service/admin.service";



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
    },
    reducers: {}, // Reducers should be defined here, if you have any
    extraReducers: (builder) => { // Define extra reducers using builder
        builder
            .addCase(Add_Group.pending, (state, action) => {
                console.log("pending Add_Group");
                state.isLoading = true;
            })
            .addCase(Add_Group.fulfilled, (state, action) => {
                state.addgroup = action.payload;
                state.isLoading = false;
            })
            .addCase(GET_ALL_SERVICES_NAMES.fulfilled, (state, action) => {
                state.AllservicesName = action.payload;
                state.isLoading = false;
            })
            .addCase(GET_ALL_SERVICES_USER_NAMES.fulfilled, (state, action) => {
                state.AllservicesuserName = action.payload;
                state.isLoading = false;
            })
            .addCase(DELETE_GROUP_SERVICE.fulfilled, (state, action) => {
                state.deletegroupService = action.payload;
                state.isLoading = false;
            });
    },
});



export default GroupServiceSlice;
