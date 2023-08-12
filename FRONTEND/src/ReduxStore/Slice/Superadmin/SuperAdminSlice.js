import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_ALL_PANELS_LIST } from "../../../Service/superadmin.service";



export const All_Panel_List = createAsyncThunk("DispatchLogin", async (data) => {
  try {
    const res = await GET_ALL_PANELS_LIST(data);
    return await res;
  } catch (err) {
    return err;
  }
});


const SuperAdminSlice = createSlice({
  name: "SuperAdminSlice",
  initialState: {
    isLoading: false,
    isError: false,
    getPanelList: []
  },

  recuders: {},
  extraReducers: {
    [All_Panel_List.pending]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, getPanelList: [], isLoading: true };
    },
    [All_Panel_List.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, getPanelList: payload, isLoading: false };
    },
  },

});

export const panellist = (state) => state && state.SuperAdminSlice?.getPanelList


// export const {ganpat} = HomeScreenSlice.actions
export default SuperAdminSlice;
