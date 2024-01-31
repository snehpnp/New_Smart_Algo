import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ADD_MESSAGE_BROADCAST, GET_ALL_MESSAGE_BROADCAST, REMOVE_MESSAGE_BROADCAST } from "../../../Service/admin.service";


export const Add_Message_Broadcast = createAsyncThunk("admin/add/broadcastmessage", async (data) => {
    const { req, token } = data

    try {
        const res = await ADD_MESSAGE_BROADCAST(req, token);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Getl_All_Message_Broadcast = createAsyncThunk("admin/all/broadcast_message", async (data) => {
    const { req, token } = data
  
    try {
        const res = await GET_ALL_MESSAGE_BROADCAST(req, token);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Remove_Message_Broadcast = createAsyncThunk("admin/all/broadcast_message", async (data) => {
    const { id, token } = data
    try {
        const res = await REMOVE_MESSAGE_BROADCAST({ id: id }, token);
        return await res;
    } catch (err) {
        return err;
    }
});

const MessageBroadcastSlice = createSlice({
    name: "MessageBroadcastSlice",
    initialState: {
        isLoading: false,
        isError: false,
        add_message: [],
        All_Message: [],
        remove_Message: [],
        status: false
    },

    recuders: {},
    extraReducers: {

        [Add_Message_Broadcast.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [Add_Message_Broadcast.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, add_message: payload, isLoading: false };
        },
        [Getl_All_Message_Broadcast.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, add_message: payload, isLoading: false };
        },
        [Remove_Message_Broadcast.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, remove_Message: payload, isLoading: false };
        },
        [Add_Message_Broadcast.rejected]: (state, action) => {
            // return { ...state, get_dashboard: action, isLoading: false };
        },

    },
});




export default MessageBroadcastSlice;
