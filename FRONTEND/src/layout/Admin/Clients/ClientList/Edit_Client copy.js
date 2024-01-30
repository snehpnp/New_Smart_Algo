/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form1"
import { useFormik } from 'formik';
import * as  valid_err from "../../../../Utils/Common_Messages"
import { useNavigate, useLocation } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import Content from '../../../../Components/Dashboard/Content/Content';
import { GET_ALL_GROUP_SERVICES, Find_One_User } from '../../../../ReduxStore/Slice/Admin/AdminSlice';
import { Get_All_SUBADMIN } from '../../../../ReduxStore/Slice/Subadmin/Subadminslice'
import { Get_All_Service_for_Client } from '../../../../ReduxStore/Slice/Common/commoSlice'
import { Get_Service_By_Group_Id } from '../../../../ReduxStore/Slice/Admin/GroupServiceSlice';


import { Add_User } from '../../../../ReduxStore/Slice/Admin/userSlice';
import toast, { Toaster } from 'react-hot-toast';

import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";







const EditClient = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()




  const user_token = JSON.parse(localStorage.getItem("user_details")).token
  const Role = JSON.parse(localStorage.getItem("user_details")).Role
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id


  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [ShowAllStratagy, setShowAllStratagy] = useState(false)
  const [UserData, setUserData] = useState([])

  console.log("UserData", UserData.data && UserData.data[0]);

  const [first, setfirst] = useState([])

  const [AllGroupServices, setAllGroupServices] = useState({
    loading: true,
    data: []
  });

  const [Addsubadmin, setAddsubadmin] = useState({
    loading: true,
    data: []
  });


  const [AllStrategy, setAllStrategy] = useState({
    loading: true,
    data: []
  });


  const [GetServices, setGetServices] = useState({
    loading: true,
    data: []
  });


  const isValidEmail = (email) => {
    return Email_regex(email)
  }
  const isValidContact = (mobile) => {
    return Mobile_regex(mobile)
  }







  // GET ALL GROUP SERVICES NAME
  const data_1 = async () => {
    await dispatch(Find_One_User({ 'id': location.state._id })).unwrap()
      .then((response) => {


        if (response.status) {
          setUserData({
            loading: false,
            data: response.data
          });
        }
      })
  }


  useEffect(() => {
    data_1()
  }, [])




  const formik = useFormik({
    initialValues: {
      username: UserData.data !== undefined && UserData.data[0] ? UserData.data && UserData.data[0].UserName : null,
      fullName: UserData.FullName ? UserData.FullName : null,
      email: UserData.Email ? UserData.Email : null,
      mobile: UserData.PhoneNo ? UserData.PhoneNo : null,
      broker: UserData.broker ? UserData.broker : null,
      licence: UserData.license_type ? UserData.license_type : null,
      groupservice: UserData.parent_id ? UserData.parent_id : null,
      service_given_month: UserData.service_given_month ? UserData.service_given_month : '0',
      parent_id: UserData.parent_id ? UserData.parent_id : null,
      strategies: [],
      tomonth: '',
      todate: null,
      fromDate: UserData.licence ? UserData.licence : null,
      app_id: 'null',
      api_type: 'null',
      client_code: 'null',
      api_key: 'null',
      api_secret: 'null',
      app_key: 'null',
      demat_userid: 'null',
      parent_role: null,
      Strategy: false,
      usemonth: UserData.licence ? UserData.licence : null
    },
    validate: (values) => {

      const errors = {};
      // if (!values.username) {
      //   errors.username = valid_err.USERNAME_ERROR;
      // }
      // if (!values.fullName) {
      //   errors.fullName = valid_err.FULLNAME_ERROR;
      // }
      // if (!values.mobile) {
      //   errors.mobile = valid_err.CONTACT_ERROR;
      // } else if (!isValidContact(values.mobile)) {
      //   errors.mobile = valid_err.INVALID_CONTACT_ERROR;
      // }



      // if (!values.licence) {
      //   errors.licence = valid_err.LICENCE_TYPE_ERROR;
      // }
      // else if (values.licence === '2' || values.licence === 2) {
      //   if (!values.broker) {
      //     errors.broker = valid_err.BROKER_ERROR;
      //   }
      //   if (!values.tomonth) {
      //     errors.tomonth = valid_err.LICENCE_ERROR;
      //   }
      // }
      // else if (values.licence === '1' || values.licence === 1) {
      //   if (!values.fromDate) {
      //     errors.fromDate = valid_err.FROMDATE_ERROR;
      //   }
      //   if (!values.todate) {
      //     errors.todate = valid_err.FROMDATE_ERROR;
      //   }
      // }




      // if (!values.groupservice) {
      //   errors.groupservice = valid_err.GROUPSELECT_ERROR;
      // }
      // if (!values.Strategy) {
      //   errors.Strategy = "select test";
      // }

      // if (!values.email) {
      //   errors.email = valid_err.EMPTY_EMAIL_ERROR;
      // } else if (!isValidEmail(values.email)) {
      //   errors.email = valid_err.INVALID_EMAIL_ERROR;
      // }

      return errors;
    },
    onSubmit: async (values) => {
      const req = {
        "FullName": values.fullName,
        "UserName": values.username,
        "Email": values.email,
        "PhoneNo": values.mobile,
        "licence": values.usemonth,
        "licence123": values.tomonth,

        "license_type": values.licence,
        "Strategies": selectedStrategies,
        "fromdate": values.fromDate,
        "todate": values.todate,
        "service_given_month": values.service_given_month,
        "broker": values.broker,
        "parent_id": values.parent_id != null ? values.parent_id : user_id,
        "parent_role": values.parent_id != null ? "SUBADMIN" : "ADMIN",
        "api_secret": values.api_secret,
        "app_id": values.app_id,
        "client_code": values.client_code,
        "api_key": values.api_key,
        "app_key": values.app_key,
        "api_type": values.api_type,
        "demat_userid": values.demat_userid,
        "group_service": values.groupservice
      }


      


      await dispatch(Add_User({ req: req, token: user_token })).unwrap().then((response) => {

        if (response.status === 409) {
          toast.error(response.data.msg);
        }
        else if (response.status) {
          toast.success(response.msg);
          setTimeout(() => {
            navigate("/admin/allclients")
          }, 1000);
        }
        else if (!response.status) {
          toast.error(response.msg);
        }

      })
    }
  });






  const handleStrategyChange = (event) => {
    const strategyId = event.target.value;


    const strategyName = event.target.name; // Assuming the label contains the strategy name

    if (event.target.checked) {
      // Add the selected strategy to the array
      setSelectedStrategies([...selectedStrategies, { id: strategyId, name: strategyName }]);
    } else {
      // Remove the deselected strategy from the array
      setSelectedStrategies(selectedStrategies.filter((strategy) => strategy.id !== strategyId));
    }
  };



  useEffect(() => {
    let Service_Month_Arr = []
    for (let index = 1; index < 2; index++) {
      Service_Month_Arr.push({ month: index, endDate: `${index} Month Licence Expired On ${new Date(new Date().getFullYear(), new Date().getMonth() + index, new Date().getDate()).toString().split('00:00:00')[0]}` })
    }
    setfirst(Service_Month_Arr)
  }, [])


  const brokerOptions = [
    { label: 'Market Hub', value: '1' },
    { label: 'Alice Blue', value: '2' },
    { label: 'Master Trust', value: '3' },
    { label: 'Motilal Oswal', value: '4' },
    { label: 'Zebull', value: '5' },
    { label: 'IIFl', value: '6' },
    { label: 'Kotak', value: '7' },
    { label: 'Mandot', value: '8' },
    { label: 'Choice', value: '9' },
    { label: 'Anand Rathi', value: '10' },
    { label: 'B2C', value: '11' },
    { label: 'Angel', value: '12' },
    { label: 'Fyers', value: '13' },
    { label: 'Zerodha', value: '15' }
  ];

  const fields = [
    { name: 'username', label: 'Username', type: 'text', label_size: 12, col_size: 6, disable: false },
    { name: 'fullName', label: 'FullName', type: 'text', label_size: 12, col_size: 6, disable: false },
    { name: 'email', label: 'Email', type: 'text', label_size: 12, col_size: 6, disable: false },
    { name: 'mobile', label: 'Mobile', type: 'text', label_size: 12, col_size: 6, disable: false },
    {
      name: 'licence',
      label: 'Licence',
      type: 'select',
      options: [
        { label: '2 Days', value: '0' },
        { label: 'Demo', value: '1' },
        { label: 'Live', value: '2' },
      ]
      , label_size: 12, col_size: 6, disable: false
    },
    {
      name: 'usemonth', label: 'Use License Month', type: 'text', label_size: 12, col_size: 6, disable: true,
      showWhen: values => values.licence === '2'
    },
    {
      name: 'tomonth',
      label: 'To Month',
      type: 'select',
      options: first && first.map((item) => ({ label: item.endDate, value: item.month })),
      showWhen: values => values.licence === '2'
      , label_size: 12, col_size: 6, disable: true, isSelected: true
    },

    {
      name: 'broker',
      label: 'Broker',
      type: 'select',
      options: brokerOptions && brokerOptions.map((item) => ({ label: item.label, value: item.value })),
      showWhen: values => values.licence === '2' || values.licence === '0'

      , label_size: 12, col_size: 6, disable: false
    },
    //  For Demo Only Client
    {
      name: 'fromDate', label: 'From Date', type: 'date',
      showWhen: values => values.licence === '1'
      , label_size: 12, col_size: 6, disable: false
    },
    {
      name: 'todate', label: 'To Date', type: 'date',
      showWhen: values => values.licence === '1'
      , label_size: 12, col_size: 6, disable: false
    },
    //  For Demo Only Client


    {
      name: 'api_key',
      label: formik.values.broker === 4 ? 'App Key' : formik.values.broker === 7 ? "Consumer Key" : formik.values.broker === 9 ? "Vendor Key" : formik.values.broker === 8 ? 'App Key' : formik.values.broker === 10 ? 'App Key' : "'Api Key", type: 'text',
      showWhen: values => values.licence === '2' && (values.broker === '4' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '12' || values.broker === '14' || values.broker === '15' || values.broker === '6')
      , label_size: 12, col_size: 6, disable: false
    },

    {
      name: 'client_code',
      label: formik.values.broker === 1 ? 'User' : formik.values.broker === 4 ? "Client Code" : formik.values.broker === 7 ? "User Name" : formik.values.broker === 9 ? "Vander Id" : formik.values.broker === 11 ? "Client Code" : formik.values.broker === 11 ? "client_code" : 'User Id', type: 'text',
      showWhen: values => values.licence === '2' && (values.broker === '1' || values.broker === '5' || values.broker === '4' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '6')
      , label_size: 12, col_size: 6, disable: false
    },
    {
      name: 'demat_userid',
      label: formik.values.broker === 9 ? 'User Id' : '', type: 'text',
      showWhen: values => values.licence === '2' && values.broker === '9'
      , label_size: 12, col_size: 6, disable: false
    },
    {
      name: 'app_id',
      label: formik.values.broker === 1 ? 'Verification Code' : formik.values.broker === 5 ? 'Password' : formik.values.broker === 7 ? 'Demat Password' : formik.values.broker === 11 ? 'Password' : formik.values.broker === 13 ? 'App Id' : formik.values.broker === 9 ? 'Password' : formik.values.broker === 14 ? 'User Id ' : 'App Id', type: 'text',
      showWhen: values => values.licence === '2' && (values.broker === '2' || values.broker === '1' || values.broker === "3" || values.broker === '5' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '13' || values.broker === '14')
      , label_size: 12, col_size: 6, disable: false
    },
    {
      name: 'app_key',
      label: formik.values.broker === 5 || 6 ? 'App Key' : "", type: 'text',
      showWhen: values => values.licence === '2' && values.broker === '5'
      , label_size: 12, col_size: 6, disable: false
    },
    {
      name: 'api_secret',
      label: formik.values.broker === 1 ? 'Password Code' : formik.values.broker === 5 ? 'DOB' : formik.values.broker === 7 ? 'Consumer Secret' : formik.values.broker === 9 ? 'Encryption Secret Key' : formik.values.broker === 10 ? 'Api Secret Key' : formik.values.broker === 11 ? '2FA' : formik.values.broker === 14 ? 'Encryption Key' : 'Api Secret', type: 'text',
      showWhen: values => values.licence === '2' && (values.broker === '1'
        || values.broker === '2' || values.broker === '3' || values.broker === '5' || values.broker === '6' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '13' || values.broker === '14' || values.broker === '15')
      , label_size: 12, col_size: 6, disable: false
    },
    {
      name: 'api_type',
      label: formik.values.broker === 5 ? 'DOB' : formik.values.broker === 7 ? 'Trade Api Password' : formik.values.broker === 9 ? 'Encryption IV' : 'Api Secret', type: 'text',
      showWhen: values =>
        values.licence === '2' && (values.broker === '7' || values.broker === '9')
      , label_size: 12, col_size: 6, disable: false
    },
    {
      name: 'parent_id',
      label: 'Sub-Admin',
      type: 'select',
      options: Addsubadmin.data && Addsubadmin.data.map((item) => ({ label: item.FullName, value: item._id }))
      , label_size: 12, col_size: 6, disable: false
    },
    {
      name: 'service_given_month',
      label: 'Service Given To Month',
      type: 'select',
      options: [
        { label: '0', value: '0' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' },
      ]
      , label_size: 12, col_size: 6, disable: false

    },


    {
      name: 'groupservice',
      label: 'Group Service',
      type: 'select',

      options:
        AllGroupServices.data && AllGroupServices.data.map((item) => ({ label: item.name, value: item._id }))
      , label_size: 12, col_size: 6, disable: false
    }

  ];



  useEffect(() => {
    if (formik.values.broker === '1' || formik.values.broker === 1) {
      formik.setFieldValue('api_key', 'null');
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '2' || formik.values.broker === 2) {
      formik.setFieldValue('api_key', 'null');
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('client_code', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }

    if (formik.values.broker === '3' || formik.values.broker === 3) {
      formik.setFieldValue('api_key', 'null');
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('client_code', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '4' || formik.values.broker === 4) {
      formik.setFieldValue('api_secret', 'null');
      formik.setFieldValue('app_id', 'null');
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '5' || formik.values.broker === 5) {
      formik.setFieldValue('api_secret', 'null');
      formik.setFieldValue('api_key', 'null');
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '6' || formik.values.broker === 6) {
      formik.setFieldValue('app_id', 'null');
      formik.setFieldValue('app_key', 'null');
      // formik.setFieldValue('client_code', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '7' || formik.values.broker === 7) {
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('api_type', 'null');
      // formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '8' || formik.values.broker === 8) {
      formik.setFieldValue('app_id', 'null');
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('client_code', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '9' || formik.values.broker === 9) {
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('api_type', 'null');
    }
    if (formik.values.broker === '10' || formik.values.broker === 10) {
      formik.setFieldValue('app_id', 'null');
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('client_code', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '11' || formik.values.broker === 11) {
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '12' || formik.values.broker === 12) {
      formik.setFieldValue('api_secret', 'null');
      formik.setFieldValue('app_id', 'null');
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('client_code', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '13' || formik.values.broker === 13) {
      formik.setFieldValue('api_key', 'null');
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('client_code', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '14' || formik.values.broker === 14) {
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('client_code', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.broker === '15' || formik.values.broker === 15) {
      formik.setFieldValue('app_id', 'null');
      formik.setFieldValue('app_key', 'null');
      formik.setFieldValue('client_code', 'null');
      formik.setFieldValue('api_type', 'null');
      formik.setFieldValue('demat_userid', 'null');
    }
    if (formik.values.licence === '2' || formik.values.licence === 2) {
      formik.setFieldValue('fromDate', null);
      formik.setFieldValue('todate', null);
    }
    if (formik.values.licence === '1' || formik.values.licence === 1) {
      formik.setFieldValue('tomonth', null);
      formik.setFieldValue('broker', null);
    }
    if (formik.values.licence === '0' || formik.values.licence === 0) {
      formik.setFieldValue('tomonth', null);
      formik.setFieldValue('broker', null);
      formik.setFieldValue('fromDate', null);
      formik.setFieldValue('todate', null);
    }


    // username: UserData.data !== undefined && UserData.data[0] ? UserData.data && UserData.data[0].UserName : null,
    //   fullName: UserData.FullName ? UserData.FullName : null,
    //   email: UserData.Email ? UserData.Email : null,
    //   mobile: UserData.PhoneNo ? UserData.PhoneNo : null,
    //   broker: UserData.broker ? UserData.broker : null,
    //   licence: UserData.license_type ? UserData.license_type : null,
    //   groupservice: UserData.parent_id ? UserData.parent_id : null,
    //   service_given_month: UserData.service_given_month ? UserData.service_given_month : '0',
    //   parent_id: UserData.parent_id ? UserData.parent_id : null,
    //   strategies: [],
    //   tomonth: '',
    //   todate: null,
    //   fromDate: UserData.licence ? UserData.licence : null,
    //   app_id: 'null',
    //   api_type: 'null',
    //   client_code: 'null',
    //   api_key: 'null',
    //   api_secret: 'null',
    //   app_key: 'null',
    //   demat_userid: 'null',
    //   parent_role: null,
    //   Strategy: false,
    //   usemonth: UserData.licence ? UserData.licence : null

    formik.setFieldValue('username', UserData.data !== undefined && UserData.data[0].UserName);







  }, [formik.values.broker, formik.values.licence]);



  useEffect(() => {

    //   mobile: UserData.PhoneNo ? UserData.PhoneNo : null,
    //   broker: UserData.broker ? UserData.broker : null,
    //   licence: UserData.license_type ? UserData.license_type : null,
    //   groupservice: UserData.parent_id ? UserData.parent_id : null,
    //   service_given_month: UserData.service_given_month ? UserData.service_given_month : '0',
    //   parent_id: UserData.parent_id ? UserData.parent_id : null,
    //   strategies: [],
    //   tomonth: '',
    //   todate: null,
    //   fromDate: UserData.licence ? UserData.licence : null,
    //   app_id: 'null',
    //   api_type: 'null',
    //   client_code: 'null',
    //   api_key: 'null',
    //   api_secret: 'null',
    //   app_key: 'null',
    //   demat_userid: 'null',
    //   parent_role: null,
    //   Strategy: false,
    //   usemonth: UserData.licence ? UserData.licence : null

    formik.setFieldValue('username', UserData.data !== undefined && UserData.data[0].UserName);
    formik.setFieldValue('fullName', UserData.data !== undefined && UserData.data[0].FullName);
    formik.setFieldValue('email', UserData.data !== undefined && UserData.data[0].Email);
    formik.setFieldValue('mobile', UserData.data !== undefined && UserData.data[0].PhoneNo);
    formik.setFieldValue('licence', UserData.data !== undefined && UserData.data[0].license_type);
    formik.setFieldValue('groupservice', UserData.data !== undefined && UserData.data[0].UserName);
    formik.setFieldValue('username', UserData.data !== undefined && UserData.data[0].UserName);
    formik.setFieldValue('username', UserData.data !== undefined && UserData.data[0].UserName);
    formik.setFieldValue('username', UserData.data !== undefined && UserData.data[0].UserName);
    formik.setFieldValue('username', UserData.data !== undefined && UserData.data[0].UserName);







  }, [UserData.data]);




  const getGroupeServics = async () => {
    if (formik.values.groupservice) {
      await dispatch(Get_Service_By_Group_Id({ _id: formik.values.groupservice })).unwrap()
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



  // GET ALL GROUP SERVICES NAME
  const data = async () => {
    await dispatch(GET_ALL_GROUP_SERVICES()).unwrap()
      .then((response) => {


        if (response.status) {
          setAllGroupServices({
            loading: false,
            data: response.data
          });
        }
      })

    await dispatch(Get_All_SUBADMIN()).unwrap()
      .then((response) => {
        if (response.status) {
          setAddsubadmin({
            loading: false,
            data: response.data
          });
        }
      })

    await dispatch(Get_All_Service_for_Client({
      req: {
      }, token: user_token
    })).unwrap().then((response) => {
      if (response.status) {
        setAllStrategy({
          loading: false,
          data: response.data
        });
      }
    })
  }


  useEffect(() => {
    data()
  }, [])






  return (
    <>
      <Content Page_title="Edit Client" button_title='Back' route="/admin/allclients">
        <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update"
          fromDate={formik.values.fromDate}
          toDate={formik.values.todate}
          additional_field={

            <>





              {GetServices && GetServices.data.map((strategy) => (
                <div className={`col-lg-2 `} key={strategy._id}>
                  <div className="col-lg-12 ">
                    {/* <div class="form-check custom-checkbox mb-3"> */}
                    <label className="form-check-label bg-primary py-2 px-4" for={strategy.ServiceResult.name}>{strategy.ServiceResult.name}</label>
                  </div>
                </div>
              ))}


              <div className="">
                <div className="row d-flex mt-3">
                  <div className="col-lg-12 ">
                    <div class="form-check custom-checkbox mb-3">
                      <input type="checkbox" name="strategy" className="form-check-input" id='strategy'
                        // {...formik.getFieldProps(field.name)}
                        onChange={(e) => {
                          setShowAllStratagy(e.target.checked)
                        }}
                      />
                      <label className="form-check-label" for='strategy'>strategy</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className='d-flex'> */}
              {ShowAllStratagy ? <>
                {AllStrategy.data.map((strategy) => (
                  <div className={`col-lg-2 mt-2`} key={strategy._id}>
                    <div className="row ">
                      <div className="col-lg-12 ">
                        <div class="form-check custom-checkbox mb-3">
                          <input type='checkbox' className="form-check-input" name={strategy.strategy_name}
                            value={strategy._id}
                            onChange={(e) => handleStrategyChange(e)}
                          />
                          <label className="form-check-label" for={strategy.strategy_name}>{strategy.strategy_name}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </> : ""}
              {/* </div> */}


              {/* </div> */}
            </>



          }

        />

        <ToastButton />

      </Content >

    </>
  )
}


export default EditClient

