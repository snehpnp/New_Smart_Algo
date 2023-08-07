import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ADD_THEME } from "../../Service/theme.service";


export const Add_Theme = createAsyncThunk("theme/add", async (data) => {
    try {
        const res = await ADD_THEME(data);
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
    },
});


export default ThemeSlice;
