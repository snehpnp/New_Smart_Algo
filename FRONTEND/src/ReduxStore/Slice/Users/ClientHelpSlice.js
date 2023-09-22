import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { CREATE_HELP } from "../../../Service/user.service";


export const Create_Help = createAsyncThunk("user/create/help", async (data) => {
    const { req, token } = data
    console.log(data);
    try {
        const res = await CREATE_HELP({ req: req }, token);
        return await res;
    } catch (err) {
        return err;
    }
});

const ClientHelpSlice = createSlice({
    name: "ClientHelpSlice",
    initialState: {
        isLoading: false,
        isError: false,
        add_help: [],
        status: false
    },

    recuders: {},
    extraReducers: {

        [Create_Help.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [Create_Help.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, add_help: payload, isLoading: false };
        },
        [Create_Help.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading: false };
        },

    },
});




export default ClientHelpSlice;
