import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { DispatchLogin } from "../../../Layout/Auth/Login";
import {
  ADD_SUBADMIN,
  EDIT_SUBADMIN,
  FIND_ONE_SUBADMIN,
  GET_CLIENT_BY_SUBADMIN_ID,
} from "../../../Service/admin.service";

export const Add_Subadmin = createAsyncThunk(
  "create/subadmin",
  async (data) => {
    const { req, token } = data;
    console.log(data);
    try {
      const res = await ADD_SUBADMIN(req, token);
      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const Edit_Subadmin = createAsyncThunk(
  "create/subadmin",
  async (data) => {
    const { req, token } = data;
    console.log(data);
    try {
      const res = await EDIT_SUBADMIN(req, token);
      return await res;
    } catch (err) {
      return err;
    }
  }
);
export const Find_One_Subadmin = createAsyncThunk(
  "find/one/subadmin",
  async (data) => {
    const { id, token } = data;
    console.log(data);
    try {
      const res = await FIND_ONE_SUBADMIN({ id: id }, token);
      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const Get_Client_By_Subadmin_Id = createAsyncThunk(
  "find/allclients/subadmin/id",
  async (data) => {
    const { id, token } = data;
    console.log(data);
    try {
      const res = await GET_CLIENT_BY_SUBADMIN_ID({ id: id }, token);
      return await res;
    } catch (err) {
      return err;
    }
  }
);

const CreateSubadminSlice = createSlice({
  name: "CreateSubadminSlice",
  initialState: {
    isLoading: false,
    isError: false,
    add_subadmin: [],
    edit_subadmin: [],
    get_sub_clients: [],
    find_one: [],
    status: false,
  },

  recuders: {},
  extraReducers: {
    [Add_Subadmin.pending]: (state, { payload }) => {
      // state.isLoading = false;
      // return { ...state, get_dashboard: [], isLoading: true };
    },
    [Add_Subadmin.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, add_subadmin: payload, isLoading: false };
    },
    [Edit_Subadmin.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, edit_subadmin: payload, isLoading: false };
    },
    [Find_One_Subadmin.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, find_one: payload, isLoading: false };
    },
    [Get_Client_By_Subadmin_Id.fulfilled]: (state, { payload }) => {
      // state.isLoading = false;
      return { ...state, get_sub_clients: payload, isLoading: false };
    },
  },
});

export default CreateSubadminSlice;
