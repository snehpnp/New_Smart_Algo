import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { ALL_SERVICES, ADD_GROUP_SERVICES } from "../../../Service/admin.service";



export const Add_Group = createAsyncThunk("admin/add/group", async (data) => {
    try {
        const res = await ADD_GROUP_SERVICES(data);

        return await res;
    } catch (err) {
        return err;
    }
});


const GroupServiceSlice = createSlice({
    name: "GroupServiceSlice",
    initialState: {
        isLoading: false,
        isError: false,
        status: false,
        addgroup: [],
        recuders: {},
        extraReducers: {

            [Add_Group.pending]: (state, action) => {
                console.log("pending Get_All_Service ");
            },
            [Add_Group.fulfilled]: (state, { payload }) => {
                return { ...state, addgroup: payload, isLoading: false };
            },
        },
    },
});



export default GroupServiceSlice;
