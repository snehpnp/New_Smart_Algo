import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_API_INFORMATION, UPDATE_API_INFORMATION, CREATE_API_INFORMATION } from "../../../Service/superadmin.service";


export const All_Api_Info_List = createAsyncThunk("getall/apiInfo", async (data) => {
    try {
        const res = await GET_API_INFORMATION(data);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Update_Api_Info_Theme = createAsyncThunk("update/apiInfo", async (data) => {
    const { req, token } = data
    try {
        const res = await UPDATE_API_INFORMATION(req, token);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Create_Api_Information = createAsyncThunk("create/apiInfo", async (data) => {
    const { req, token } = data
    try {
        const res = await CREATE_API_INFORMATION(req, token);
        return await res;
    } catch (err) {
        return err;
    }
});






const ApiCreateInfoSlice = createSlice({
    name: "ApiCreateInfoSlice",
    initialState: {
        isLoading: false,
        isError: false,
        getPanelList: [],
        update_panel_theme: [],
        Create_Api_Information: [],
        get_all_Api_Information: [],
        update_Api_Information: [],
    },

    recuders: {},
    extraReducers: {
        [Create_Api_Information.pending]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, getPanelList: [], isLoading: true };
        },
        [Create_Api_Information.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, Create_Api_Information: payload, isLoading: false };
        },
        [All_Api_Info_List.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, get_all_Api_Information: payload, isLoading: false };
        },
        [Update_Api_Info_Theme.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, update_Api_Information: payload, isLoading: false };
        },
    },

});



// export const {ganpat} = HomeScreenSlice.actions
export default ApiCreateInfoSlice;
