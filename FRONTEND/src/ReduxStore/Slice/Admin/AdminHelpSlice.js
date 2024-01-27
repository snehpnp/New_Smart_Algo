import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_HELP_REQUEST } from "../../../Service/admin.service";


export const GET_HELPS = createAsyncThunk("user/all/helps", async (data) => {
    const { user_id, token } = data
    
    try {
        const res = await GET_HELP_REQUEST({ _id: user_id }, token);
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
        status: false
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

    },
});




export default AdminHelpSlice;
