import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_USER_BROKER_INFO } from "../../../Service/user.service";


export const User_Api_Create_Info = createAsyncThunk("user/create/api_create", async (data) => {
    const { user_id, token } = data
    console.log(data);
    try {
        const res = await GET_USER_BROKER_INFO({ user_id: user_id }, token);
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
        api_create: [],
        status: false
    },

    recuders: {},
    extraReducers: {

        [User_Api_Create_Info.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [User_Api_Create_Info.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, api_create: payload, isLoading: false };
        },

    },
});




export default ClientHelpSlice;
