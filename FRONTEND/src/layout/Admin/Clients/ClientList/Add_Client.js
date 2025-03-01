import React, { useEffect, useState } from "react";
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form1";
import { useFormik } from "formik";
import * as valid_err from "../../../../Utils/Common_Messages";
import { useNavigate, useLocation } from "react-router-dom";
import { Get_Pmermission } from "../../../../ReduxStore/Slice/Users/DashboardSlice";

import {
  Email_regex,
  Mobile_regex,
  Name_regex,
} from "../../../../Utils/Common_regex";
import { useDispatch, useSelector } from "react-redux";
import Content from "../../../../Components/Dashboard/Content/Content";
import { GET_ALL_GROUP_SERVICES } from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import { Get_All_SUBADMIN } from "../../../../ReduxStore/Slice/Subadmin/Subadminslice";
import { Get_All_Service_for_Client } from "../../../../ReduxStore/Slice/Common/commoSlice";
import {
  Get_Service_By_Group_Id,
  Get_All_Plans,
} from "../../../../ReduxStore/Slice/Admin/GroupServiceSlice";
import { All_Api_Info_List } from "../../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice";
import * as Config from "../../../../Utils/Config";
import {
  Add_User,
  GetLastCretedUserName,
} from "../../../../ReduxStore/Slice/Admin/userSlice";
import toast, { Toaster } from "react-hot-toast";
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
import "../../../../App.css";

const AddClient = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [GetBrokerInfo, setGetBrokerInfo] = useState([]);
  const [ShowAllStratagy, setShowAllStratagy] = useState(false);
  const [first, setfirst] = useState([]);
  const [Addsubadmin, setAddsubadmin] = useState({ loading: true, data: [] });
  const [AllStrategy, setAllStrategy] = useState({ loading: true, data: [] });
  const [GetServices, setGetServices] = useState({ loading: true, data: [] });
  const [selectedPlan, setSelectedPlan] = useState("");
  const [admin_permission, setAdmin_permission] = useState([]);
  const [GetAllPlans, setAllPlans] = useState({ loading: true, data: [] });
  const [LastUSerName, setLastUSerName] = useState("");
  const [AllGroupServices, setAllGroupServices] = useState({
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
  const selector = useSelector((state) => state.DashboardSlice);

  useEffect(() => {
    GetAllPlansData();
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

  useEffect(() => {
    AdminPermissions();
    data();
    Get_Last_User_Name();
  }, []);

  const GetAllPlansData = async () => {
    await dispatch(Get_All_Plans())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllPlans({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  const AdminPermissions = async () => {
    await dispatch(
      Get_Pmermission({
        domain: Config.react_domain,
        token: user_details.token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAdmin_permission({
            loading: false,
            data: response.data,
          });
        } else {
          setAdmin_permission({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  const formik = useFormik({
    initialValues: {
      LastUsername: "",
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
      api_secret: "",
      app_key: "null",
      demat_userid: "null",
      parent_role: null,
      Strategy: false,
      multiple_strategy_select: false,
    },
    validate: (values) => {
      const errors = {};
      if (!values.username && formik.touched.username) {
        errors.username = valid_err.USERNAME_ERROR;
      }
      if (!values.fullName && formik.touched.fullName) {
        errors.fullName = valid_err.FULLNAME_ERROR;
      } else if (!isValidName(values.fullName) && formik.touched.fullName) {
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
      if (!values.licence && formik.touched.licence) {
        errors.licence = valid_err.LICENCE_TYPE_ERROR;
      } else if (values.licence === "2" || values.licence === 2) {
        if (!values.broker) {
          errors.broker = valid_err.BROKER_ERROR;
        }
        if (!values.tomonth) {
          errors.tomonth = valid_err.LICENCE_ERROR;
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

      if (!values.groupservice && formik.touched.groupservice) {
        errors.groupservice = valid_err.GROUPSELECT_ERROR;
      }
      if (
        selectedStrategies.length === 0 &&
        formik.touched.selectedStrategies
      ) {
        errors.Strategy = "select strategy";
      }

      return errors;
    },
    onSubmit: async (values) => {
      if (!values.email || !values.fullName || !values.mobile) {
        toast.error("All Fields Are Mandatory");
        return;
      }

      if (!values.groupservice || selectedStrategies.length === 0) {
        toast.error("All Fields Are Mandatory");
        return;
      }

      if (values.license_type == 2) {
        if (
          !values.licence ||
          values.licence == null ||
          values.licence == "" ||
          values.licence == "0"
        ) {
          toast.error("Live Client Licence is Mandatory");
          return;
        }
      }

      const req = {
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.mobile,
        licence: values.tomonth,
        license_type: values.licence,
        Strategies: selectedStrategies,
        fromdate: values.fromDate,
        todate: values.todate,
        service_given_month: values.service_given_month,
        broker: values.broker,
        parent_id:
          values.parent_id == null || values.parent_id === ""
            ? user_details.user_id
            : values.parent_id,
        parent_role:
          values.parent_id == null || values.parent_id === ""
            ? "ADMIN"
            : "SUBADMIN",
        api_secret: values.api_secret,
        app_id: values.app_id,
        client_code: values.client_code,
        api_key: values.api_key,
        app_key: values.app_key,
        api_type: values.api_type,
        demat_userid: values.demat_userid,
        group_service: values.groupservice,
        multiple_strategy_select:
          values.multiple_strategy_select === false ? "0" : "1",
        plan_id: selectedPlan,
      };

      await dispatch(Add_User({ req: req, token: user_details.token }))
        .unwrap()
        .then((response) => {
          if (response.status === 409) {
            toast.error(response.data.msg);
          } else if (response.status) {
            toast.success(response.msg);
            navigate("/admin/allclients");
          } else if (!response.status) {
            toast.error(response.msg);
          }
        });
    },
  });

  useEffect(() => {
    if (formik.values.broker === "1" || formik.values.broker === 1) {
      formik.setFieldValue("api_key", "null");
      // formik.setFieldValue("app_key", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }
    if (formik.values.broker === "2" || formik.values.broker === 2) {
      formik.setFieldValue("api_key", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
    }
    if (formik.values.broker === "3" || formik.values.broker === 3) {
      formik.setFieldValue("api_key", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }
    if (formik.values.broker === "4" || formik.values.broker === 4) {
      formik.setFieldValue("api_secret", "null");
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }
    if (formik.values.broker === "5" || formik.values.broker === 5) {
      formik.setFieldValue("api_secret", "null");
      formik.setFieldValue("api_key", "null");
      formik.setFieldValue("app_key", "null");
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
      formik.setFieldValue("api_secret", "null");
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
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }
    if (formik.values.broker === "26" || formik.values.broker === 26) {
      formik.setFieldValue("app_id", "null");
      formik.setFieldValue("app_key", "null");
      formik.setFieldValue("client_code", "null");
      formik.setFieldValue("api_type", "null");
      formik.setFieldValue("demat_userid", "null");
    }
    if (formik.values.broker === "27" || formik.values.broker === 27) {
      // formik.setFieldValue("api_key", "null");
      // formik.setFieldValue("client_code", "null");
      // formik.setFieldValue("api_secret", "null");
      // formik.setFieldValue("api_type", "null");
    }
    if (formik.values.broker === "28" || formik.values.broker === 28) {
      // formik.setFieldValue("api_key", "null");
      // formik.setFieldValue("client_code", "null");
      // formik.setFieldValue("api_secret", "null");
      // formik.setFieldValue("api_type", "null");
    }

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

  useEffect(() => {
    getGroupeServics();
  }, [formik.values.groupservice]);

  useEffect(() => {
    formik.setFieldValue(
      "username",
      (location.state !== null && location.state.UserName) || ""
    );
    formik.setFieldValue(
      "fullName",
      (location.state !== null && location.state.FullName) || ""
    );
    formik.setFieldValue(
      "email",
      (location.state !== null && location.state.Email) || ""
    );
    formik.setFieldValue(
      "mobile",
      (location.state !== null && location.state.PhoneNo) || ""
    );
  }, [location.state]);

  const handleStrategyChange = (event) => {
    const strategyId = event.target.value;
    const strategyName = event.target.name;
    if (event.target.checked) {
      setSelectedStrategies([
        ...selectedStrategies,
        { id: strategyId, name: strategyName },
      ]);
      formik.setFieldValue("Strategy", selectedStrategies);
    } else {
      setSelectedStrategies(
        selectedStrategies.filter((strategy) => strategy.id !== strategyId)
      );
    }
  };

  const Get_Last_User_Name = async () => {
    await dispatch(GetLastCretedUserName())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setLastUSerName(response.data.UserName);
          formik.setFieldValue("LastUsername", response.data.UserName);
        }
      })
      .catch((error) => {
        return;
      });
  };

  let fields = [
    {
      name: "LastUsername",
      label: "Last Username",
      type: "lastusername",
      label_size: 12,
      col_size: 6,
      disable: true,
    },
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
      options: [
        { label: "2 Days", value: "0" },
        { label: "Demo", value: "1" },
        { label: "Live", value: "2" },
      ],
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "tomonth",
      label: "To Month",
      type: "select",
      options:
        first &&
        first.map((item) => ({ label: item.endDate, value: item.month })),
      showWhen: (values) => values.licence === "2",
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
      label:
        formik.values.broker == 20
          ? "ACCESS TOKEN "
          : formik.values.broker == 19
          ? "Api Key"
          : formik.values.broker == 4
          ? "App Key"
          : formik.values.broker == 7
          ? "Consumer Key"
          : formik.values.broker == 9
          ? "Vendor Key"
          : formik.values.broker == 8
          ? "App Key"
          : formik.values.broker == 10
          ? "App Key"
          : formik.values.broker == 26
          ? "App Key"
          : formik.values.broker == 27
          ? "ApI Key"
          : formik.values.broker == 25
          ? "Api Key"
          : formik.values.broker == 28
          ? "Vendor Id"
          : "Api Key",
      type: "text",
      showWhen: (values) =>
        values.broker === "4" ||
        values.broker === "7" ||
        values.broker === "8" ||
        values.broker === "9" ||
        values.broker === "10" ||
        values.broker === "11" ||
        values.broker === "12" ||
        values.broker === "14" ||
        values.broker === "15" ||
        values.broker === "6" ||
        values.broker === "19" ||
        values.broker === "20" ||
        values.broker === "26" ||
        values.broker === "27" ||
        values.broker === "25" ||
        values.broker === "28",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "client_code",
      label:
        formik.values.broker == 21
          ? "CLIENT CODE"
          : formik.values.broker == 20
          ? "CLIENT ID"
          : formik.values.broker == 1
          ? "Login Id"
          : formik.values.broker == 4
          ? "Client Code"
          : formik.values.broker == 9
          ? "Vander Id"
          : formik.values.broker == 11
          ? "Client Code"
          : formik.values.broker == 11
          ? "client_code"
          : formik.values.broker == 27
          ? "Vendor Code"
          : formik.values.broker == 28
          ? "User Id"
          : "User Id",
      type: "text",
      showWhen: (values) =>
        values.broker === "1" ||
        values.broker === "5" ||
        values.broker === "4" ||
        // values.broker === "7" ||
        values.broker === "9" ||
        values.broker === "11" ||
        values.broker === "6" ||
        values.broker === "20" ||
        values.broker === "27" ||
        values.broker === "21" ||
        values.broker === "28",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "demat_userid",
      label:
        formik.values.broker == 9
          ? "User Id"
          : formik.values.broker == 28
          ? "Vendor Key"
          : "",
      type: "text",
      showWhen: (values) => values.broker === "9" || values.broker === "28",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "app_id",
      label:
        formik.values.broker == 21
          ? "MPIN"
          : formik.values.broker == 1
          ? "Pancard Number"
          : formik.values.broker == 5
          ? "Password"
          : // : formik.values.broker == 7
          // ? "Demat Password"
          formik.values.broker == 11
          ? "Password"
          : formik.values.broker == 2
          ? "Demat UserId"
          : formik.values.broker == 13
          ? "App Id"
          : formik.values.broker == 9
          ? "Password"
          : formik.values.broker == 14
          ? "User Id "
          : formik.values.broker == 28
          ? "Encryption Secret Key"
          : "App Id",
      type: "text",
      showWhen: (values) =>
        values.broker === "1" ||
        values.broker === "2" ||
        values.broker === "3" ||
        values.broker === "5" ||
        // values.broker === "7" ||
        values.broker === "9" ||
        values.broker === "11" ||
        values.broker === "13" ||
        values.broker === "14" ||
        values.broker === "21" ||
        values.broker === "28",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "app_key",
      label:
        formik.values.broker == 5 || formik.values.broker ==  6
          ? "App Key"
          : formik.values.broker == 1
          ? "Factor Two"
          : formik.values.broker == 28
          ? "Encryption IV"
          : "",
      type: "text",
      showWhen: (values) => values.broker === "5" || values.broker === "1" || values.broker === "6" || values.broker === "28",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "api_secret",
      label:
        formik.values.broker == 1
          ? "Password"
          : formik.values.broker == 5
          ? "DOB"
          : formik.values.broker == 7
          ? "Consumer Secret"
          : formik.values.broker == 9
          ? "Encryption Secret Key"
          : formik.values.broker == 10
          ? "Api Secret Key"
          : formik.values.broker == 11
          ? "2FA"
          : formik.values.broker == 14
          ? "Encryption Key"
          : formik.values.broker == 26
          ? "Api Secret"
          : formik.values.broker == 25
          ? "Api Secret"
          : formik.values.broker == 27
          ? "imei"
          : formik.values.broker == 28
          ? "Password"
          : "Api Secret",
      type: "text",
      showWhen: (values) =>
        values.broker === "1" ||
        values.broker === "3" ||
        values.broker === "5" ||
        values.broker === "6" ||
        values.broker === "7" ||
        values.broker === "8" ||
        values.broker === "9" ||
        values.broker === "10" ||
        values.broker === "11" ||
        values.broker === "13" ||
        values.broker === "14" ||
        values.broker === "15" ||
        values.broker === "19" ||
        values.broker === "26" ||
        values.broker === "27" ||
        values.broker === "25" || 
        values.broker === "28",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "api_type",
      label:
        formik.values.broker == 5
          ? "DOB"
          : // : formik.values.broker == 7
          // ? "Trade Api Password"
          formik.values.broker == 9
          ? "Encryption IV"
          : "Api Secret",
      type: "text",
      showWhen: (values) =>
        //  values.broker === "7" ||
        values.broker === "9",
      label_size: 12,
      col_size: 6,
      disable: false,
    },

    {
      name: "parent_id",
      label: "Sub-Admin",
      type: "select",
      options:
        Addsubadmin.data &&
        Addsubadmin.data.map((item) => ({
          label: item.FullName,
          value: item._id,
        })),
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
    },
    {
      name: "multiple_strategy_select",
      label: "Mutiple Selection Strategy",
      type: "checkbox",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
  ];

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

  const data = async () => {
    await dispatch(GET_ALL_GROUP_SERVICES())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllGroupServices({
            loading: false,
            data: response.data,
          });
        }
      });

    await dispatch(Get_All_SUBADMIN())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAddsubadmin({
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
          setAllStrategy({
            loading: false,
            data: response.data,
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

  if (selector && selector.permission) {
    if (
      selector.permission &&
      selector.permission.data &&
      selector.permission.data[0]
    ) {
      if (selector.permission.data[0].Two_day_client == 0) {
        fields = fields.map((field) => {
          if (field.name === "licence") {
            return {
              ...field,
              options: field.options.filter(
                (option) => option.label !== "2 Days"
              ),
            };
          }
          return field;
        });
      }
    }
  }

  return (
    <>
      <Content
        Page_title="Add Client"
        button_title="Back"
        route="/admin/allclients"
      >
        <Formikform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name="Add Client"
          fromDate={formik.values.fromDate}
          toDate={formik.values.todate}
          LastUSerName={LastUSerName}
          additional_field={
            <>
              {GetServices.data && <h6>All Group Service</h6>}

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
              {admin_permission.data && admin_permission.data[0].Plans == 0 ? (
                ""
              ) : (
                <div>
                  <h6>Select Plans</h6>
                  <div className="row">
                    {GetAllPlans.data.map((plan, index) => (
                      <div className="col-lg-2 mt-2" key={index}>
                        <div className="form-check custom-radio mb-3">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="plan"
                            value={plan._id}
                            id={plan._id}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            checked={selectedPlan === plan._id}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={plan._id}
                          >
                            {plan.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formik.errors.Strategy && (
                <div style={{ color: "red" }} className="my-3">
                  {formik.errors.Strategy}{" "}
                </div>
              )}

              <h6>All Strategy</h6>
              <>
                {AllStrategy.data.map((strategy) => (
                  <div className={`col-lg-2 mt-2`} key={strategy._id}>
                    <div className="row ">
                      <div className="col-lg-12 ">
                        <div className="form-check custom-checkbox mb-3">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name={strategy.strategy_name}
                            value={strategy._id}
                            onChange={(e) => handleStrategyChange(e)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={strategy.strategy_name}
                          >
                            {strategy.strategy_name}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            </>
          }
        />

        <ToastButton />
      </Content>
    </>
  );
};
export default AddClient;
