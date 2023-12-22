import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import { GET_ALL_PANELS_LIST, UPDATE_PANEL_THEME, CLOSE_ADMIN_PANEL, GET_PANEL_INFORMATION, UPDATE_ADMIN_PERMISSION, GET_ADMIN_HELPS, ADD_LICENCE_TO_COMPANY, GET_ALL_SUBADMIN_CLIENT, GET_ALL_ADMIN_CLIENT, GET_PANEL_BROKER } from "../../../Service/superadmin.service";


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
    const res = await UPDATE_PANEL_THEME({ theme_id: theme_id, userid: userid }, token);
    return await res;
  } catch (err) {
    return err;
  }
});

export const GET_PANEL_INFORMATIONS = createAsyncThunk("get/panel/info", async (data) => {
  const { id, token } = data

  try {
    const res = await GET_PANEL_INFORMATION(data, token);
    return await res;
  } catch (err) {
    return err;
  }
});


export const GET_PANEL_BROKERS = createAsyncThunk("get/panel/info", async (data) => {
  const { domain } = data

  try {
    const res = await GET_PANEL_BROKER(data);
    return await res;
  } catch (err) {
    return err;
  }
});

export const Get_All_Admin_Client = createAsyncThunk("get/all/clients", async (data) => {
  const { id, token } = data

  try {
    const res = await GET_ALL_ADMIN_CLIENT(data, token);
    return await res;
  } catch (err) {
    return err;
  }
});


export const Get_All_Subadmin_Client = createAsyncThunk("get/all/clients", async (data) => {
  const { id, token } = data

  try {
    const res = await GET_ALL_SUBADMIN_CLIENT(data, token);
    return await res;
  } catch (err) {
    return err;
  }
});


export const Add_Licence_To_Company = createAsyncThunk("get/all/clients", async (data) => {
  const { id, token } = data

  try {
    const res = await ADD_LICENCE_TO_COMPANY(data, token);
    return await res;
  } catch (err) {
    return err;
  }
});
export const Get_Admin_Helps = createAsyncThunk("/getall/panel/helps", async (req, token) => {
  // const { req, token } = data

  try {
    const res = await GET_ADMIN_HELPS(req, token);
    return await res;
  } catch (err) {
    return err;
  }
});


export const Update_Admin_Permissions = createAsyncThunk("/update/permission", async (req, token) => {
  // const { req, token } = data

  try {
    const res = await UPDATE_ADMIN_PERMISSION(req, token);
    return await res;
  } catch (err) {
    return err;
  }
});


export const Close_Admin_Panel = createAsyncThunk("/update/comapny/status", async (req, token) => {
  // const { req, token } = data

  try {
    const res = await CLOSE_ADMIN_PANEL(req);
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
    update_panel_theme: [],
    panel_info: [],
    admin_client_list: [],
    subadmin_list: [],
    add_licence: [],
    admin_helps: [],
    admin_permission: [],
    panel_brokers: [],
    close_panel: [],

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
    [GET_PANEL_INFORMATIONS.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, panel_info: payload, isLoading: false };
    },
    [Get_All_Admin_Client.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, admin_client_list: payload, isLoading: false };
    },
    [Get_All_Subadmin_Client.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, subadmin_list: payload, isLoading: false };
    },
    [Add_Licence_To_Company.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, add_licence: payload, isLoading: false };
    },
    [Get_Admin_Helps.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, admin_helps: payload, isLoading: false };
    },
    [Update_Admin_Permissions.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, admin_permission: payload, isLoading: false };
    },
    [GET_PANEL_BROKERS.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, panel_brokers: payload, isLoading: false };
    },
    [Close_Admin_Panel.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, close_panel: payload, isLoading: false };
    },
  },

});

export const panellist = (state) => state && state.SuperAdminSlice?.getPanelList


// export const {ganpat} = HomeScreenSlice.actions
export default SuperAdminSlice;
