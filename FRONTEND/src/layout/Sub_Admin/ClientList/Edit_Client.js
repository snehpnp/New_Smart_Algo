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
import { useDispatch } from "react-redux";
import Content from "../../../Components/Dashboard/Content/Content";
import { GET_ALL_GROUP_SERVICES } from "../../../ReduxStore/Slice/Admin/AdminSlice";
import {
  Find_One_User,
  Update_User,
} from "../../../ReduxStore/Slice/Subadmin/userSlice";
import { Get_All_Service_for_Client } from "../../../ReduxStore/Slice/Common/commoSlice";
import { Get_Service_By_Group_Id } from "../../../ReduxStore/Slice/Admin/GroupServiceSlice";
import { check_Device } from "../../../Utils/find_device";
import { Get_Sub_Admin_Permissions } from "../../../ReduxStore/Slice/Subadmin/Subadminslice";
import { All_Api_Info_List } from "../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice";
import * as Config from "../../../Utils/Config";
import toast from "react-hot-toast";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import "../../../App.css";
import { f_time } from "../../../Utils/Date_formet";

const AddClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isgotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));

  const user_details = JSON.parse(localStorage.getItem("user_details"));

  const [UserData, setUserData] = useState({ loading: true, data: [] });
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [first, setfirst] = useState([]);
  const [getPermissions, setGetPermissions] = useState([]);
  const [GetBrokerInfo, setGetBrokerInfo] = useState([]);
  const [AllGroupServices, setAllGroupServices] = useState({
    loading: true,
    data: [],
  });
  const [AllStrategy, setAllStrategy] = useState({ loading: true, data: [] });
  const [GetServices, setGetServices] = useState({ loading: true, data: [] });

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
    await dispatch(Find_One_User({ id: location.state._id }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setUserData({
            loading: false,
            data: response,
          });
        }
      });

    await dispatch(
      All_Api_Info_List({
        token: user_details.token,
        url: Config.react_domain,
        brokerId: -1,
        key: 1,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setGetBrokerInfo(response.data);
        }
      });
  };

  useEffect(() => {
    data_1();
  }, []);

  //  SUBADMIN PERMISSION
  const data2 = async () => {
    await dispatch(Get_Sub_Admin_Permissions({ id: user_details.user_id }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setGetPermissions(response.data[0]);
        }
      });
  };
  useEffect(() => {
    data2();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: null,
      fullName: null,
      email: null,
      mobile: null,
      broker: null,
      licence: null,
      groupservice: null,
      service_given_month: "0",
      parent_id: null,
      strategies: [],
      tomonth: null,
      todate: null,
      fromDate: null,
      app_id: "null",
      api_type: "null",
      client_code: "null",
      api_key: "null",
      api_secret: "null",
      app_key: "null",
      demat_userid: "null",
      parent_role: null,
      Strategy: false,
      licence1: "null",
      multiple_strategy_select: false,
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = valid_err.USERNAME_ERROR;
      }
      if (!values.fullName) {
        errors.fullName = valid_err.FULLNAME_ERROR;
      } else if (!isValidName(values.fullName)) {
        errors.fullName = valid_err.INVALID_ERROR;
      }
      if (!values.mobile) {
        errors.mobile = valid_err.CONTACT_ERROR;
      } else if (!isValidContact(values.mobile)) {
        errors.mobile = valid_err.INVALID_CONTACT_ERROR;
      }

      if (!values.licence) {
        errors.licence = valid_err.LICENCE_TYPE_ERROR;
      } else if (values.licence === "2" || values.licence === 2) {
        if (!values.broker) {
          errors.broker = valid_err.BROKER_ERROR;
        }
      } else if (values.licence === "0" || values.licence === 0) {
        if (!values.broker) {
          errors.broker = valid_err.BROKER_ERROR;
        }
      } else if (values.licence === "1" || values.licence === 1) {
        if (!values.fromDate) {
          errors.fromDate = valid_err.FROMDATE_ERROR;
        }
        if (!values.todate) {
          errors.todate = valid_err.FROMDATE_ERROR;
        }
      }
      if (!values.groupservice) {
        errors.groupservice = valid_err.GROUPSELECT_ERROR;
      }
      if (selectedStrategies.length === 0) {
        errors.Strategy = "select strategy";
      }

      if (!values.email) {
        errors.email = valid_err.EMPTY_EMAIL_ERROR;
      } else if (!isValidEmail(values.email)) {
        errors.email = valid_err.INVALID_EMAIL_ERROR;
      }

      return errors;
    },
    onSubmit: async (values) => {
      const req = {
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.mobile,
        licence1: values.tomonth,
        license_type: values.licence,
        Strategies: selectedStrategies.filter((item) => item.checked === true),
        fromdate: values.fromDate,
        todate: values.todate,
        service_given_month: values.service_given_month,
        broker: values.broker,
        parent_id:
          values.parent_id != null ? values.parent_id : user_details.user_id,
        parent_role: values.parent_id != null ? "SUBADMIN" : "ADMIN",
        api_secret: values.api_secret,
        app_id: values.app_id,
        client_code: values.client_code,
        api_key: values.api_key,
        app_key: values.app_key,
        api_type: values.api_type,
        demat_userid: values.demat_userid,
        group_service: values.groupservice,
        licence: values.licence1,
        Editor_role: user_details.Role,
        device: check_Device(),
        multiple_strategy_select:
          UserData.data.data[0].multiple_strategy_select,
      };

      await dispatch(Update_User({ req: req, token: user_details.token }))
        .unwrap()
        .then((response) => {
          if (response.status === 409) {
            toast.error(response.data.msg);
          } else if (response.status) {
            toast.success(response.msg);
            setTimeout(() => {
              navigate("/subadmin/clients");
            }, 1000);
          } else if (!response.status) {
            toast.error(response.msg);
          }
        });
    },
  });

  useEffect(() => {
    formik.setFieldValue(
      "username",
      UserData.data.data !== undefined && UserData.data.data[0].UserName
    );
    formik.setFieldValue(
      "fullName",
      UserData.data.data !== undefined && UserData.data.data[0].FullName
    );
    formik.setFieldValue(
      "email",
      UserData.data.data !== undefined && UserData.data.data[0].Email
    );
    formik.setFieldValue(
      "mobile",
      UserData.data.data !== undefined && UserData.data.data[0].PhoneNo
    );
    formik.setFieldValue(
      "licence",
      UserData.data.data !== undefined && UserData.data.data[0].license_type
    );
    formik.setFieldValue(
      "licence1",
      UserData.data.data !== undefined && UserData.data.data[0].licence
    );
    formik.setFieldValue(
      "groupservice",
      UserData.data.data !== undefined &&
        UserData.data.data[0].groupservices_clients.groupService_id
    );
    formik.setFieldValue(
      "service_given_month",
      UserData.data.data !== undefined &&
        UserData.data.data[0].service_given_month
    );
    formik.setFieldValue(
      "broker",
      UserData.data.data !== undefined && UserData.data.data[0].broker
    );
    formik.setFieldValue(
      "parent_id",
      UserData.data.data !== undefined && UserData.data.data[0].parent_id
    );
    formik.setFieldValue(
      "app_id",
      UserData.data.data !== undefined && UserData.data.data[0].app_id
    );
    formik.setFieldValue(
      "api_type",
      UserData.data.data !== undefined && UserData.data.data[0].api_type
    );
    formik.setFieldValue(
      "client_code",
      UserData.data.data !== undefined && UserData.data.data[0].client_code
    );
    formik.setFieldValue(
      "api_key",
      UserData.data.data !== undefined && UserData.data.data[0].api_key
    );
    formik.setFieldValue(
      "api_secret",
      UserData.data.data !== undefined && UserData.data.data[0].api_secret
    );
    formik.setFieldValue(
      "app_key",
      UserData.data.data !== undefined && UserData.data.data[0].app_key
    );
    formik.setFieldValue(
      "demat_userid",
      UserData.data.data !== undefined && UserData.data.data[0].demat_userid
    );
    formik.setFieldValue(
      "todate",
      UserData.data.data !== undefined && f_time(UserData.data.data[0].EndDate)
    );
    formik.setFieldValue(
      "fromDate",
      UserData.data.data !== undefined &&
        f_time(UserData.data.data[0].StartDate)
    );
  }, [UserData.data, getPermissions]);

  useEffect(() => {
    let Service_Month_Arr = [];
    for (let index = 1; index < 2; index++) {
      Service_Month_Arr.push({
        month: index,
        endDate: `${index} Month Licence Expired On ${
          new Date(
            new Date().getFullYear(),
            new Date().getMonth() + index,
            new Date().getDate()
          )
            .toString()
            .split("00:00:00")[0]
        }`,
      });
    }
    setfirst(Service_Month_Arr);
  }, []);

  const fields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
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
    {
      name: "licence",
      label: "Licence",
      type: "select",
      options:
        getPermissions && Number(getPermissions.license_permision) === 1
          ? UserData.data.data !== undefined &&
            UserData.data.data[0].license_type === "2"
            ? [{ label: "Live", value: "2" }]
            : UserData.data.data !== undefined &&
              UserData.data.data[0].license_type === "0"
            ? [
                { label: "2 Days", value: "0" },
                { label: "Live", value: "2" },
              ]
            : [
                { label: "2 Days", value: "0" },
                { label: "Demo", value: "1" },
                { label: "Live", value: "2" },
              ]
          : UserData.data.data !== undefined &&
            UserData.data.data[0].license_type === "2"
          ? [{ label: "Live", value: "2" }]
          : UserData.data.data !== undefined &&
            UserData.data.data[0].license_type === "0"
          ? [{ label: "2 Days", value: "0" }]
          : [
              { label: "2 Days", value: "0" },
              { label: "Demo", value: "1" },
            ],
      label_size: 12,
      col_size: 6,
      disable:
        UserData.data.data !== undefined &&
        UserData.data.data[0].license_type === "2"
          ? true
          : false,
    },
    {
      name: "licence1",
      label: "Use License Month",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: true,
      showWhen: (values) => values.licence === "2",
    },
    {
      name: "tomonth",
      label: "To Month",
      type: "select",
      options:
        first &&
        first.map((item) => ({ label: item.endDate, value: item.month })),
      showWhen: (values) =>
        getPermissions && Number(getPermissions.license_permision) === 1
          ? Number(values.licence) === 2
          : null,
      label_size: 12,
      col_size: 6,
      disable: false,
      isSelected: true,
    },
    {
      name: "broker",
      label: "Broker",
      type: "select",
      options:
        GetBrokerInfo &&
        GetBrokerInfo.map((item) => ({
          label: item.title,
          value: item.broker_id,
        })),
      showWhen: (values) => values.licence === "2" || values.licence === "0",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "fromDate",
      label: "From Date",
      type: "date1",
      showWhen: (values) => values.licence === "1",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "todate",
      label: "To Date",
      type: "date1",
      showWhen: (values) => values.licence === "1",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "api_key",
      label: (() => {
        const brokerLabels = {
          20: "ACCESS TOKEN",
          19: "Api Key",
          4: "App Key",
          7: "Consumer Key",
          9: "Vendor Key",
          8: "App Key",
          10: "App Key",
          26: "App Key",
          25: "Api Key",
          27: "Api Key",
          28: "Vendor Id",
        };
    
        return brokerLabels[formik.values.broker] || "Api Key";
      })(),
      type: "text",
      showWhen: (values) => {
        const allowedBrokers = [
          "4", "7", "8", "9", "10", "11", "12", "14", "15", "6", 
          "19", "20", "26", "27", "25", "28"
        ];
        return allowedBrokers.includes(values.broker);
      },
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    
    {
      name: "client_code",
      label: (() => {
        const brokerLabels = {
          21: "CLIENT CODE",
          20: "CLIENT ID",
          1: "User",
          4: "Client Code",
          9: "Vander Id",
          11: "Client Code",
          27: "Vendor Code",
          28: "User Id",
        };
    
        return brokerLabels[formik.values.broker] || "User Id";
      })(),
      type: "text",
      showWhen: (values) => {
        const allowedBrokers = [
          "1", "5", "4", "9", "11", "6", "20", "27", "21", "28"
        ];
        return allowedBrokers.includes(values.broker);
      },
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    
    {
      name: "demat_userid",
      label: (() => {
        const brokerLabels = {
          9: "User Id",
          28: "Vendor Key",
        };
    
        return brokerLabels[formik.values.broker] || "Demat UserId";
      })(),
      type: "text",
      showWhen: (values) => {
        const allowedBrokers = ["9", "2", "28"];
        return allowedBrokers.includes(values.broker);
      },
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    
    {
      name: "app_id",
      label: (() => {
        const brokerLabels = {
          21: "MPIN",
          1: "Verification Code",
          5: "Password",
          11: "Password",
          2: "Demat UserId",
          13: "App Id",
          9: "Password",
          14: "User Id",
          28: "Encryption Secret Key",
        };
    
        return brokerLabels[formik.values.broker] || "App Id";
      })(),
      type: "text",
      showWhen: (values) => {
        const allowedBrokers = [
          "1", "3", "5", "9", "11", "13", "14", "21", "28"
        ];
        return allowedBrokers.includes(values.broker);
      },
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    
    {
      name: "app_key",
      label: (() => {
        const brokerLabels = {
          5: "App Key",
          6: "App Key",
          28: "Encryption IV",
        };
    
        return brokerLabels[formik.values.broker] || "";
      })(),
      type: "text",
      showWhen: (values) => ["5", "6", "28"].includes(values.broker),
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    
    {
      name: "api_secret",
      label: (() => {
        const brokerLabels = {
          1: "Password Code",
          5: "DOB",
          7: "Consumer Secret",
          9: "Encryption Secret Key",
          10: "Api Secret Key",
          11: "2FA",
          14: "Encryption Key",
          26: "Api Secret",
          25: "Api Secret",
          27: "imei",
          28: "Password",
        };
    
        return brokerLabels[formik.values.broker] || "Api Secret";
      })(),
      type: "text",
      showWhen: (values) =>
        [
          "1", "3", "5", "6", "7", "8", "9", "10", "11", 
          "13", "14", "15", "19", "26", "27", "25", "28"
        ].includes(values.broker),
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    
    {
      name: "api_type",
      label: (() => {
        const brokerLabels = {
          5: "DOB",
          9: "Encryption IV",
        };
    
        return brokerLabels[formik.values.broker] || "Api Secret";
      })(),
      type: "text",
      showWhen: (values) => values.broker === "9",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    
    {
      name: "service_given_month",
      label: "Service Given To Month",
      type: "select",
      options: [
        { label: "0", value: "0" },
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" },
        { label: "11", value: "11" },
        { label: "12", value: "12" },
      ],
      showWhen: (values) => values.licence === "2" || values.licence === 2,
      label_size: 12,
      col_size: 6,
      disable: false,
    },

    {
      name: "groupservice",
      label: "Group Service",
      type: "select",

      options:
        AllGroupServices.data &&
        AllGroupServices.data.map((item) => ({
          label: item.name,
          value: item._id,
        })),
      label_size: 12,
      col_size: 6,
      disable: false,
      showWhen: (values) => getPermissions?.groupservice_Permission === 1,
    },
    // {
    //   name: 'multiple_strategy_select', label: 'Mutiple Selection Strategy', type: 'checkbox', label_size: 12, col_size: 6, disable: false, check_box_true: formik.values.multiple_strategy_select ? true : false,
    // },
  ];

  useEffect(() => {
    if (formik.values.broker === "1" || formik.values.broker === 1) {
      formik.setFieldValue("api_key", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "2" || formik.values.broker === 2) {
      formik.setFieldValue("api_key", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      // formik.setFieldValue('demat_userid', 'null');
    }

    if (formik.values.broker === "3" || formik.values.broker === 3) {
      formik.setFieldValue("api_key", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "4" || formik.values.broker === 4) {
      formik.setFieldValue("api_secret", "null 1");
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "5" || formik.values.broker === 5) {
      // formik.setFieldValue('api_secret', 'null 2');
      formik.setFieldValue("api_key", "null");
      // formik.setFieldValue('app_key', 'null');
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "6" || formik.values.broker === 6) {
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "7" || formik.values.broker === 7) {
      formik.setFieldValue("app_key", "null");
    }

    if (formik.values.broker === "8" || formik.values.broker === 8) {
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "9" || formik.values.broker === 9) {
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("api_type", "null");
    }

    if (formik.values.broker === "10" || formik.values.broker === 10) {
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }
    if (formik.values.broker === "11" || formik.values.broker === 11) {
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }
    if (formik.values.broker === "12" || formik.values.broker === 12) {
      formik.setFieldValue("api_secret", "null 3");
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }
    if (formik.values.broker === "13" || formik.values.broker === 13) {
      formik.setFieldValue("api_key", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }
    if (formik.values.broker === "14" || formik.values.broker === 14) {
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }
    if (formik.values.broker === "15" || formik.values.broker === 15) {
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "19" || formik.values.broker === 19) {
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "20" || formik.values.broker === 20) {
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "21" || formik.values.broker === 21) {
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "26" || formik.values.broker === 26) {
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }

    if (formik.values.broker === "27" || formik.values.broker === 27) {
      // formik.setFieldValue("api_key", "null");
      // formik.setFieldValue("client_code", "null");
      // formik.setFieldValue("api_secret", "null");
      // formik.setFieldValue("api_type", "null");
    }

    ////////////////--------------END BROKER SET KEY----------------///////////

    if (formik.values.licence === "2" || formik.values.licence === 2) {
      formik.setFieldValue("fromDate", null);
      formik.setFieldValue("todate", null);
    }
    if (formik.values.licence === "1" || formik.values.licence === 1) {
      formik.setFieldValue("tomonth", null);
      formik.setFieldValue("broker", null);
    }
    if (formik.values.licence === "0" || formik.values.licence === 0) {
      formik.setFieldValue("fromDate", null);
      formik.setFieldValue("todate", null);
    }
  }, [formik.values.broker, formik.values.licence]);

  const getGroupeServics = async () => {
    if (formik.values.groupservice) {
      await dispatch(
        Get_Service_By_Group_Id({ _id: formik.values.groupservice })
      )
        .unwrap()
        .then((response) => {
          if (response.status) {
            setGetServices({
              loading: false,
              data: response.data,
            });
          }
        });
    }
  };

  useEffect(() => {
    getGroupeServics();
  }, [formik.values.groupservice]);

  const data = async () => {
    await dispatch(GET_ALL_GROUP_SERVICES())
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (getPermissions && getPermissions.group_services !== undefined) {
            let abc =
              response.data &&
              response.data.filter(
                (item) =>
                  getPermissions.group_services !== undefined &&
                  getPermissions.group_services.includes(item._id)
              );
            if (abc.length > 0) {
              setAllGroupServices({
                loading: false,
                data: abc,
              });
            }
            return;
          }

          setAllGroupServices({
            loading: false,
            data: response.data,
          });
        }
      });

    await dispatch(
      Get_All_Service_for_Client({
        req: {},
        token: user_details.token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (getPermissions && getPermissions.strategy !== undefined) {
            let abc = response.data.map((item) => ({
              ...item,
              status:
                getPermissions.strategy !== undefined &&
                getPermissions.strategy.includes(item._id),
            }));

            if (abc.length > 0) {
              setAllStrategy({
                loading: false,
                data: abc,
              });
            }
            return;
          }

          setAllStrategy({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  useEffect(() => {
    data();
  }, [getPermissions]);

  const handleStrategyChange = (event) => {
    const strategyId = event.target.value;
    setSelectedStrategies((prevStrategies) => {
      return prevStrategies.map((strategy) =>
        strategy.id === strategyId
          ? { ...strategy, checked: !strategy.checked }
          : strategy
      );
    });
  };

  useEffect(() => {
    if (UserData.data.strategy) {
      const initialSelectedStrategies = AllStrategy.data.map((strategy) => ({
        id: strategy._id,
        name: strategy.strategy_name,
        status: strategy.status,
        checked: UserData.data.strategy.some(
          (item) => item.strategy_id === strategy._id
        ),
      }));
      setSelectedStrategies(initialSelectedStrategies);
    }
  }, [UserData.data.strategy, AllStrategy.data]);

  return (
    <>
      <Content
        Page_title="Edit  Client"
        button_title="Back"
        route="/subadmin/clients"
        showEdit={true}
        show_Stat_End_date={
          UserData.data.data !== undefined && UserData.data.data[0]
        }
      >
        <Formikform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name={isgotodashboard && isgotodashboard ? null : "Update"}
          fromDate={formik.values.fromDate}
          toDate={formik.values.todate}
          hidebtn={isgotodashboard && isgotodashboard}
          additional_field={
            <>
              {(getPermissions?.groupservice_Permission === 1 ||
                getPermissions?.groupservice_Permission === "1") && (
                <>
                  <h5 className="mt-5"> All Group Services </h5>
                  {GetServices &&
                    GetServices.data.map((strategy) => (
                      <div className={`col-lg-2 `} key={strategy._id}>
                        <div className="col-lg-12 ">
                          <label
                            className="form-check-label bg-primary text-white py-2 px-4"
                            htmlFor={strategy.ServiceResult.name}
                          >{`${strategy.ServiceResult.name}[${strategy.categories.segment}]`}</label>
                        </div>
                      </div>
                    ))}
                  <label className="toggle mt-3">
                    <input
                      className="toggle-checkbox bg-primary"
                      type="checkbox"
                      onChange={(e) => {}}
                    />
                  </label>
                </>
              )}

              {(getPermissions?.Strategy_Permission === 1 ||
                getPermissions?.Strategy_Permission === "1") && (
                <>
                  <h5> All Strategy </h5>
                  {selectedStrategies.map((strategy) => (
                    <div className={`col-lg-2 mt-2`} key={strategy.id}>
                      <div className="row ">
                        <div className="col-lg-12 ">
                          <div className="form-check custom-checkbox mb-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name={strategy.id}
                              value={strategy.id}
                              onChange={(e) => handleStrategyChange(e)}
                              checked={strategy.checked}
                              disabled={!strategy.status}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={strategy.name}
                            >
                              {strategy.name}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          }
        />
        <ToastButton />
      </Content>
    </>
  );
};
export default AddClient;
