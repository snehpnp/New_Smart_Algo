import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ADD_CLIENT,
  DawnloadData,
  GetLastUserName,
  DeletePlans
} from "../../../Service/admin.service";

export const Add_User = createAsyncThunk("admin/user/add", async (apireq) => {
  const { req, token } = apireq;
  try {
    const res = await ADD_CLIENT(req, token);
    return await res;
  } catch (err) {
    return err;
  }
});

export const DawnloadDataUser = createAsyncThunk(
  "dawnload/data",
  async (apireq) => {
    const { req, token } = apireq;
    try {
      const res = await DawnloadData(req, token);
      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const GetLastCretedUserName = createAsyncThunk(
  "get/last/username",
  async () => {
    try {
      const res = await GetLastUserName();
      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const DeletePlan = createAsyncThunk(
  "delete/plans",
  async (apireq) => {
    const { req, token } = apireq;
    try {
      const res = await DeletePlans(req, token);
      return await res;
    } catch (err) {
      return err;
    }
  }
);

const AdminUserSlice = createSlice({
  name: "AdminUserSlice",
  initialState: {
    isLoading: false,
    isError: false,
    status: false,
    add_user: [],
    data: [],
    delete_plan: [],
  },
  reducers: {}, // Define any reducers here if needed
  extraReducers: {
    [Add_User.fulfilled]: (state, { payload }) => {
      return { ...state, add_user: payload, isLoading: false };
    },
    [DawnloadDataUser.fulfilled]: (state, { payload }) => {
      return { ...state, isLoading: false };
    },
    [GetLastCretedUserName.fulfilled]: (state, { payload }) => {
      return { ...state, data: payload, isLoading: false };
    },
    [DeletePlan.fulfilled]: (state, { payload }) => {
      return { ...state, delete_plan: payload, isLoading: false };
    }
  },
});

export default AdminUserSlice;
