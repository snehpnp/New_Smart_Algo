import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_HELP_REQUEST ,UpdatePricePermission,pnlpositionUpdate,GetPnlPostion} from "../../../Service/admin.service";


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

export const UPDATE_PNL_POSITION = createAsyncThunk("update/pnlposition", async (data) => {
    const { pnlposition, token } = data
    try {
        const res = await pnlpositionUpdate({ pnlposition: pnlposition }, token);
        return await res;
    } catch (err) {
        return err;
    }
});


export const GET_PNL_POSITION = createAsyncThunk("get/pnlposition", async (data) => {
    const { token } = data
    try {
        const res = await GetPnlPostion({ token: token });
        return await res;
    } catch (err) {
        return
    }
});



const AdminHelpSlice = createSlice({
    name: "AdminHelpSlice",
    initialState: {
        isLoading: false,
        isError: false,
        helps: [],
        status: false,
        permissionStatus : false,
        pnlpositionStatus : false,
        pnlposition: [],
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
        [UPDATE_PNL_POSITION.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [UPDATE_PNL_POSITION.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, pnlpositionStatus: payload, isLoading: false };
        },
        [UPDATE_PNL_POSITION.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading:
        },
        [GET_PNL_POSITION.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [GET_PNL_POSITION.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, pnlposition: payload, isLoading: false };
        },
        [GET_PNL_POSITION.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading: false };
        },
        
        

    },
});




export default AdminHelpSlice;
