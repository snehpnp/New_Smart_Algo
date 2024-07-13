import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_API_INFORMATION, UPDATE_API_INFORMATION, CREATE_API_INFORMATION, GET_API_INFORMATION_SUPERADMIN ,GET_FAQ_DATA,DELETE_FAQ_DATA,ADD_FAQ_DATA,UPDATE_FAQ_DATA} from "../../../Service/superadmin.service";


export const All_Api_Info_List = createAsyncThunk("getall/apiInfo", async (data) => {
    const { token, url, brokerId, key } = data

    try {
        const res = await GET_API_INFORMATION({ url: url, brokerId: brokerId, key: key }, token);
        return await res;
    } catch (err) {
        return err;
    }
});



export const All_Api_Info_List_superadmin = createAsyncThunk("getall/apiInfo", async (data) => {
    const { token, url } = data

    try {
        const res = await GET_API_INFORMATION_SUPERADMIN({ url: url }, token);
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

export const GET_ALL_FAQ_DATA = createAsyncThunk("getll/faq", async () => {
   
    try {
        const res = await GET_FAQ_DATA();
        return await res;
    } catch (err) {
        return err;
    }
});

export const Delete_faq = createAsyncThunk("delete/faq", async (data) => {
    const { req, token } = data
    try {
        const res = await DELETE_FAQ_DATA(data);
        return await res;
    } catch (err) {
        return err;
    }
});

export const ADD_FAQ = createAsyncThunk("add/faq", async (data) => {

    try {
        const res = await ADD_FAQ_DATA(data);
        return await res;
    } catch (err) {
        return err;
    }
});

export const UPDATE_FAQ = createAsyncThunk("update/faq", async (data) => {
    const { req, token } = data
    try {
        const res = await UPDATE_FAQ_DATA(data);
        return await res;
    } catch (err) {
        return
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
        get_all_Api_Informationsuper: [],
        update_Api_Information: [],
        get_all_faq_data:[],
        delete_faq:[],
        add_faq:[],
        update_faq:[]

    },

    recuders: {},
    extraReducers: {
        [Create_Api_Information.pending]: (state, { payload }) => {

            return { ...state, getPanelList: [], isLoading: true };
        },
        [Create_Api_Information.fulfilled]: (state, { payload }) => {

            return { ...state, Create_Api_Information: payload, isLoading: false };
        },
        [All_Api_Info_List.fulfilled]: (state, { payload }) => {

            return { ...state, get_all_Api_Information: payload, isLoading: false };
        },
        [All_Api_Info_List_superadmin.fulfilled]: (state, { payload }) => {

            return { ...state, get_all_Api_Informationsuper: payload, isLoading: false };
        },
        [Update_Api_Info_Theme.fulfilled]: (state, { payload }) => {

            return { ...state, update_Api_Information: payload, isLoading: false };
        },
        [GET_ALL_FAQ_DATA.fulfilled]: (state, { payload }) => {

            return { ...state, get_all_faq_data: payload, isLoading: false };
        },
        [Delete_faq.fulfilled]: (state, { payload }) => {
            return { ...state, delete_faq: payload, isLoading: false };
        },
        [ADD_FAQ.fulfilled]: (state, { payload }) => {
            return { ...state, add_faq: payload, isLoading: false };
        },
        [UPDATE_FAQ.fulfilled]: (state, { payload }) => {
            return { ...state, update_faq: payload, isLoading: false };
        },
    },

});



export default ApiCreateInfoSlice;
