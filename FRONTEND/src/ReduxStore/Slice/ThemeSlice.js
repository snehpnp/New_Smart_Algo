import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ADD_THEME, GET_ALL_THEME } from "../../Service/theme.service";


export const Add_Theme = createAsyncThunk("theme/add", async (data) => {
    try {
        const res = await ADD_THEME(data);
        return await res;
    } catch (err) {
        return err;
    }
});
export const Get_All_Theme = createAsyncThunk("theme/getall", async (data) => {
    try {
        const res = await GET_ALL_THEME(data);
        // console.log("res" ,res);
        return await res;
    } catch (err) {
        return err;
    }
});

const ThemeSlice = createSlice({
    name: "ThemeSlice",
    initialState: {
        isLoading: false,
        isError: false,
        add_theme: [],
        gettheme: [],
        status : false
    },

    recuders: {},
    extraReducers: {
        [Add_Theme.pending]: (state, action) => {
            console.log("Pending");
        },
        [Add_Theme.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            return { ...state, add_theme: payload };
        },
        [Add_Theme.rejected]: (state, action) => {
            return { ...state, add_theme: action, isLoading: false };
        },
        [Get_All_Theme.pending]: (state, action) => {
            return { ...state, gettheme: [], isLoading: true };
        },
        [Get_All_Theme.fulfilled]: (state, { payload }) => {
            console.log("payload" ,payload);
            return { ...state, gettheme: payload, status: false };
        },
        [Get_All_Theme.rejected]: (state, action) => {
            return { ...state, gettheme: action, status: false };

        },
    },
});


export const getthemedata = (state) => state && state.ThemeSlice


export default ThemeSlice;
