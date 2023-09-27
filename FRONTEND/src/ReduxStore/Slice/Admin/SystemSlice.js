import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { UPDATE_SMTP_DETAILS, UPDATE_COMPANY_DETAILS } from "../../../Service/admin.service";



export const Update_smtp_details = createAsyncThunk("update/smtp", async (data) => {
    const { req, token } = data
    console.log(data);
    try {
        const res = await UPDATE_SMTP_DETAILS(req, token);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Update_Company_details = createAsyncThunk("update/company", async (data) => {
    const { req, token } = data
    console.log(data);
    try {
        const res = await UPDATE_COMPANY_DETAILS(req, token);
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
        smtp: [],
        company: [],
        status: false
    },

    recuders: {},
    extraReducers: {

        [Update_smtp_details.pending]: (state, { payload }) => {
            // state.isLoading = false;
            // return { ...state, get_dashboard: [], isLoading: true };
        },
        [Update_smtp_details.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, smtp: payload, isLoading: false };
        },
        [Update_Company_details.fulfilled]: (state, { payload }) => {
            // state.isLoading = false;
            return { ...state, company: payload, isLoading: false };
        },

    },
});




export default AdminHelpSlice;
