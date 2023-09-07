import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_ALL_PANELS_LIST, UPDATE_PANEL_THEME } from "../../../Service/superadmin.service";


export const All_Panel_List = createAsyncThunk("DispatchLogin", async (data) => {
  try {
    const res = await GET_ALL_PANELS_LIST(data);
    return await res;
  } catch (err) {
    return err;
  }
});
export const Update_Panel_Theme = createAsyncThunk("update/theme", async (data) => {
  const { theme_id, userid, token } = data
  try {
    const res = await UPDATE_PANEL_THEME({ theme_id: theme_id, userid: userid }, token );
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
    getPanelList: [],
    update_panel_theme: []
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
    [Update_Panel_Theme.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, update_panel_theme: payload, isLoading: false };
    },
  },

});

export const panellist = (state) => state && state.SuperAdminSlice?.getPanelList


// export const {ganpat} = HomeScreenSlice.actions
export default SuperAdminSlice;
