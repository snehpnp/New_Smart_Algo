import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_HELP_REQUEST ,UpdatePricePermission} from "../../../Service/admin.service";


export const GET_HELPS = createAsyncThunk("user/all/helps", async (data) => {
    const { user_id, token } = data
    
    try {
        const res = await GET_HELP_REQUEST({ _id: user_id }, token);
        return await res;
    } catch (err) {
        return err;
    }
});

export const UPDATE_PRICE_PERMISSION = createAsyncThunk("update/pricepermission", async (data) => {
    const { status, token } = data
    try {
        const res = await UpdatePricePermission({ status: status }, token);
        return await res;
    } catch (err) {
        return err;
    }
});



const AdminHelpSlice = createSlice({
    name: "AdminHelpSlice",
    initialState: {
        isLoading: false,
        isError: false,
        helps: [],
        status: false,
        permissionStatus : false
    },

    recuders: {},
    extraReducers: {

        [GET_HELPS.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [GET_HELPS.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, helps: payload, isLoading: false };
        },
        [GET_HELPS.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading: false };
        },
        [UPDATE_PRICE_PERMISSION.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [UPDATE_PRICE_PERMISSION.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, permissionStatus: payload, isLoading: false };
        },
        [UPDATE_PRICE_PERMISSION.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading: false };
        },
        

    },
});




export default AdminHelpSlice;
