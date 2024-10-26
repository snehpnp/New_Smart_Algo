/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form1";
import { useFormik } from "formik";
import * as valid_err from "../../../Utils/Common_Messages";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Email_regex,
  Mobile_regex,
  Name_regex,
} from "../../../Utils/Common_regex";
import { useDispatch, useSelector } from "react-redux";
import Content from "../../../Components/Dashboard/Content/Content";
import {
  Find_One_User,
  SUPER_UPDATE_USER_DATA,
} from "../../../ReduxStore/Slice/Superadmin/SuperAdminSlice";

import toast, { Toaster } from "react-hot-toast";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import "../../../App.css";

const EditClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const RowId = localStorage.getItem("RowData");
  const backend_rul = localStorage.getItem("backend_rul");
  const UserName = JSON.parse(localStorage.getItem("user_details")).UserName;
  const panel_name = localStorage.getItem("panel_name");

  const [UserData, setUserData] = useState({
    loading: true,
    data: [],
  });

  const isValidEmail = (email) => {
    return Email_regex(email);
  };
  const isValidContact = (mobile) => {
    return Mobile_regex(mobile);
  };

  const isValidName = (mobile) => {
    return Name_regex(mobile);
  };

  // GET USER DETAILS
  const data_1 = async () => {
    const data = { id: location.state._id, backend_rul: backend_rul };
    await dispatch(Find_One_User(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setUserData({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  useEffect(() => {
    data_1();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: null,
      fullName: null,
      email: null,
      mobile: null,
      licence: null,
    },

    validate: (values) => {
      const errors = {};
      if (!values.username && formik.touched.username) {
        errors.username = valid_err.USERNAME_ERROR;
      }
      if (!values.fullName && formik.touched.fullName) {
        errors.fullName = valid_err.FULLNAME_ERROR;
      } else if (!isValidName(values.fullName)) {
        errors.fullName = valid_err.INVALID_ERROR;
      }
      if (!values.mobile && formik.touched.mobile) {
        errors.mobile = valid_err.CONTACT_ERROR;
      } else if (!isValidContact(values.mobile) && formik.touched.mobile) {
        errors.mobile = valid_err.INVALID_CONTACT_ERROR;
      }

      if (!values.email && formik.touched.email) {
        errors.email = valid_err.EMPTY_EMAIL_ERROR;
      } else if (!isValidEmail(values.email) && formik.touched.email) {
        errors.email = valid_err.INVALID_EMAIL_ERROR;
      }

      return errors;
    },
    onSubmit: async (values) => {
      const req = {
        backend_rul: backend_rul,
        id: location.state._id,
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.mobile,
        license_type: values.licence,
        panel_name: panel_name,
        superadmin_name: UserName,
      };

      await dispatch(SUPER_UPDATE_USER_DATA(req))
        .unwrap()
        .then((response) => {
          if (response.status === 409) {
            toast.error(response.data.msg);
          } else if (response.status) {
            toast.success(response.msg);
            setTimeout(() => {
              navigate("/super/showclient");
            }, 500);
          } else if (!response.status) {
            toast.error(response.msg);
          }
        });
    },
  });

  
  useEffect(() => {
    if( UserData.data.length > 0){
  

    formik.setFieldValue(
      "username",
      UserData.data !== undefined && UserData.data[0].UserName
    );
    formik.setFieldValue(
      "fullName",
      UserData.data !== undefined && UserData.data[0].FullName
    );
    formik.setFieldValue(
      "email",
      UserData.data !== undefined && UserData.data[0].Email
    );
    formik.setFieldValue(
      "mobile",
      UserData.data !== undefined && UserData.data[0].PhoneNo
    );
    formik.setFieldValue(
      "licence",
      UserData.data !== undefined && UserData.data[0].licence
    );
}
  }, [UserData.data]);

  const fields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: true,
    },
    {
      name: "fullName",
      label: "FullName",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "mobile",
      label: "Mobile",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    // {
    //   name: "licence",
    //   label: "Licence",
    //   type: "select",
    //   options:
    //     UserData.data.data !== undefined &&
    //     UserData.data.data[0].license_type === "2"
    //       ? [{ label: "Live", value: "2" }]
    //       : UserData.data.data !== undefined &&
    //         UserData.data.data[0].license_type === "0"
    //       ? [
    //           { label: "2 Days", value: "0" },
    //           { label: "Live", value: "2" },
    //         ]
    //       : [
    //           { label: "2 Days", value: "0" },
    //           { label: "Demo", value: "1" },
    //           { label: "Live", value: "2" },
    //         ],
    //   label_size: 12,
    //   col_size: 6,
    //   disable: true,
    // },
  ];

  return (
    <>
      <Content
        Page_title="Edit  Client"
        button_title="Back"
        route="/super/showclient"
      >
        <Formikform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name="Update"
          fromDate={formik.values.fromDate}
          toDate={formik.values.todate}
          additional_field={<div className="mt-3"></div>}
        />
        <ToastButton />
      </Content>
    </>
  );
};
export default EditClient;
