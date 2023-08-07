/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import * as  valid_err from "../../../../Utils/Common_Messages"
// import { toast } from "react-toastify";
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import Content from '../../../../Components/Dashboard/Content/Content';
import Theme_Content from '../../../../Components/Dashboard/Content/Theme_Content';
// import "../../../component/admin/admin-assets/css/style.css"


// import { AddClients } from "../../../ReduxStore/Slice/AdminMasters"



const AddClient = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const AdminToken = JSON.parse(localStorage.getItem('user_details')).accessToken;
  // const userid = JSON.parse(localStorage.getItem('user_details')).id;
  // const roleId = JSON.parse(localStorage.getItem('user_details')).roleId;
  // const admin_id = JSON.parse(localStorage.getItem('user_details')).admin_id;
  // const RoleId = JSON.parse(localStorage.getItem('user_details')).roles;




  const [showLoader, setshowLoader] = useState(false)


  const isValidEmail = (email) => {
    return Email_regex(email)
  }
  const isValidContact = (mobile) => {
    return Mobile_regex(mobile)
  }


  const setRoleId = (role) => {
    if (role === "ADMIN") {
      return "2"
    }
    else if (role === "USER") {
      return "4"
    }
    else if (role === "SUPERADMIN") {
      return "1"
    }
    else if (role === "MASTER") {
      return "2"
    }
  }



  const formik = useFormik({
    initialValues: {
      username: '',
      fullName: '',
      email: '',
      mobile: '',
      broker: '',
      licencetype: '',
      tomonth: "0",
      app_id: 'null',
      api_type: 'null',
      client_code: 'null',
      api_key: 'null',
      api_secret: 'null',
      app_key: 'null',
      demat_userid: 'null'

    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = valid_err.USERNAME_ERROR;
      }
      if (!values.fullName) {
        errors.fullName = valid_err.FULLNAME_ERROR;
      }
      if (!values.mobile) {
        errors.mobile = valid_err.CONTACT_ERROR;
      } else if (!isValidContact(values.mobile)) {
        errors.mobile = valid_err.INVALID_CONTACT_ERROR;
      }
      // if (!values.licencetype) {
      //   errors.licence = valid_err.LICENCE_TYPE_ERROR;
      // }
      // if (!values.tomonth) {
      //   errors.tomonth = valid_err.LICENCE_ERROR;
      // }
      if (!values.broker) {
        errors.broker = valid_err.BROKER_ERROR;
      }
      // if (!values.apisecret) {
      //   errors.apisecret = valid_err.APISECRET_ERROR;
      // }
      // if (!values.apikey) {
      //   errors.apikey = valid_err.APIKEY_ERROR;
      // }
      // if (!values.apiid) {
      //   errors.apiid = valid_err.APIID_ERROR;
      // }

      if (!values.email) {
        errors.email = valid_err.EMPTY_EMAIL_ERROR;
      } else if (!isValidEmail(values.email)) {
        errors.email = valid_err.INVALID_EMAIL_ERROR;
      }

      return errors;
    },
    onSubmit: async (values) => {

      const req = {
        // "fullname": values.fullName,
        // "username": values.username,
        // "email": values.email,
        // "phone_number": values.mobile,
        // "license_type": "1",
        // "licence": "0",
        // "roleId": "3",
        // "roles": RoleId,
        // "master_id": "0",
        // "parent_admin_id": userid,
        // "parent_role_id": setRoleId(RoleId),
        // // "parent_role_id": roleId,
        // "broker": values.broker,
        // "api_secret": values.api_secret,
        // "app_id": values.app_id,
        // "client_code": values.client_code,
        // "api_key": values.api_key,
        // "app_key": values.app_key,
        // "api_type": values.api_type,

        // "demat_userid": values.demat_userid
      }

      // console.log("res", req);
      // return

      //   await dispatch(AddClients({ req: req, AdminToken: AdminToken })).then((res) => {


      //     if (res.meta.requestStatus === "fulfilled") {
      //       if (res.payload === "Failed! Username is already in use!") {
      //         toast.error(res.payload)
      //       } else {
      //         toast.success(res.payload.data)
      //         // setshowLoader(false)
      //         // setshowLoader(false)
      //         setTimeout(() => {
      //           navigate("/admin/masters")
      //         }, 2000);
      //       }
      //     }

      //   })
    }
  });


  const fields = [
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'fullName', label: 'FullName', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'mobile', label: 'Mobile', type: 'text' },
    {
      name: 'licence',
      label: 'Licence',
      type: 'select',
      options: [
        { label: 'Demo', value: '1' },
        { label: 'Live', value: '2' },

      ],
    },
    {
      name: 'tomonth',
      label: 'Licence',
      type: 'select',
      options: [
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
      ],
      showWhen: values => values.licence === '2'

    },

    {
      name: 'broker',
      label: 'Broker',
      type: 'select',
      options: [
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
        { label: '5-Paisa', value: '14' },
        { label: 'Zerodha', value: '15' },

      ],
      showWhen: values => values.licence === '2'
    },


    //  For Demo Only Client
    {
      name: 'fromdate', label: 'From Date', type: 'date',
      showWhen: values => values.licence === '1'

    },
    {
      name: 'todate', label: 'To Date', type: 'date',
      showWhen: values => values.licence === '1'
    },
    //  For Demo Only Client


    {
      name: 'api_key',
      label: formik.values.broker === 4 ? 'App Key' : formik.values.broker === 7 ? "Consumer Key" : formik.values.broker === 9 ? "Vendor Key" : formik.values.broker === 8 ? 'App Key' : formik.values.broker === 10 ? 'App Key' : "'Api Key", type: 'text',
      showWhen: values => values.licence === '2' && (values.broker === '4' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '12' || values.broker === '14' || values.broker === '15' || values.broker === '6')
    },

    {
      name: 'client_code',
      label: formik.values.broker === 1 ? 'User' : formik.values.broker === 4 ? "Client Code" : formik.values.broker === 7 ? "User Name" : formik.values.broker === 9 ? "Vander Id" : formik.values.broker === 11 ? "Client Code" : formik.values.broker === 11 ? "client_code" : 'User Id', type: 'text',
      showWhen: values => values.licence === '2' && (values.broker === '1' || values.broker === '5' || values.broker === '4' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '6')
    },
    {
      name: 'demat_userid',
      label: formik.values.broker === 9 ? 'User Id' : '', type: 'text',
      showWhen: values => values.licence === '2' && values.broker === '9'
    },
    {
      name: 'app_id',
      label: formik.values.broker === 1 ? 'Verification Code' : formik.values.broker === 5 ? 'Password' : formik.values.broker === 7 ? 'Demat Password' : formik.values.broker === 11 ? 'Password' : formik.values.broker === 13 ? 'App Id' : formik.values.broker === 9 ? 'Password' : formik.values.broker === 14 ? 'User Id ' : 'App Id', type: 'text',
      showWhen: values => values.licence === '2' && (values.broker === '2' || values.broker === '1' || values.broker === "3" || values.broker === '5' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '13' || values.broker === '14')
    },



    {
      name: 'app_key',
      label: formik.values.broker === 5 || 6 ? 'App Key' : "", type: 'text',
      showWhen: values => values.licence === '2' && values.broker === '5'
    },

    {
      name: 'api_secret',
      label: formik.values.broker === 1 ? 'Password Code' : formik.values.broker === 5 ? 'DOB' : formik.values.broker === 7 ? 'Consumer Secret' : formik.values.broker === 9 ? 'Encryption Secret Key' : formik.values.broker === 10 ? 'Api Secret Key' : formik.values.broker === 11 ? '2FA' : formik.values.broker === 14 ? 'Encryption Key' : 'Api Secret', type: 'text',
      showWhen: values => values.licence === '2' && (values.broker === '1'
        || values.broker === '2' || values.broker === '3' || values.broker === '5' || values.broker === '6' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '13' || values.broker === '14' || values.broker === '15')
    },
    {
      name: 'api_type',
      label: formik.values.broker === 5 ? 'DOB' : formik.values.broker === 7 ? 'Trade Api Password' : formik.values.broker === 9 ? 'Encryption IV' : 'Api Secret', type: 'text',
      showWhen: values =>
        values.licence === '2' && (values.broker === '7' || values.broker === '9')
    },
    {
      name: 'groupservice',
      label: 'Group Service',
      type: 'select',
      options: [
        { label: 'group1', value: '1' },
        { label: 'group2', value: '1' },
        { label: 'group3', value: '1' },
        { label: 'group4', value: '1' },
        { label: 'group5', value: '1' },
      ],
      showWhen: values => values.licence === '2'
    },

    {
      name: 'servicemonth',
      label: 'Service Month Given',
      type: 'select',
      options: [
        { label: 'month1', value: '1' },
        { label: 'month2', value: '2' },
        { label: 'month3', value: '3' },
        { label: 'month4', value: '4' },
        { label: 'month5', value: '5' },
        { label: 'month6', value: '6' },
        { label: 'month7', value: '7' },
        { label: 'month8', value: '8' },
        { label: 'month0', value: '9' },
        { label: 'month10', value: '10' },
        { label: 'month11', value: '11' },
        { label: 'month12', value: '12' },
      ],
    },
    {
      name: 'subadmin',
      label: 'Sub-Admin',
      type: 'select',
      options: [
        { label: 'subadmin1', value: '1' },
        { label: 'subadmin2', value: '2' },
        { label: 'subadmin3', value: '3' },
        { label: 'subadmin4', value: '4' },
        { label: 'subadmin5', value: '5' },
        { label: 'subadmin6', value: '6' },
        { label: 'subadmin7', value: '7' },
        { label: 'subadmin8', value: '8' },
        { label: 'subadmin0', value: '9' },
        { label: 'subadmin10', value: '10' },
        { label: 'subadmin11', value: '11' },
      ],
    },

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
  }, [formik.values.broker]);



  return (
    <>
      <Theme_Content Page_title="HelpCenter">
        <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Master" />
      </Theme_Content >

    </>
  )
}


export default AddClient

