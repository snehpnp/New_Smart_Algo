/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
//okkkkkk
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

import { GET_ALL_GROUP_SERVICES } from '../../../../ReduxStore/Slice/Admin/AdminSlice';
import { Get_All_SUBADMIN } from '../../../../ReduxStore/Slice/Subadmin/Subadminslice'
import { Get_All_Service_for_Client } from '../../../../ReduxStore/Slice/Common/commoSlice'
import { Add_User } from '../../../../ReduxStore/Slice/Admin/userSlice';






const AddClient = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const user_token = JSON.parse(localStorage.getItem("user_details")).token
  const Role = JSON.parse(localStorage.getItem("user_details")).Role
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id


  const [selectedStrategies, setSelectedStrategies] = useState([]);

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



  const isValidEmail = (email) => {
    return Email_regex(email)
  }
  const isValidContact = (mobile) => {
    return Mobile_regex(mobile)
  }


  const formik = useFormik({
    initialValues: {
      username: null,
      fullName: null,
      email: null,
      mobile: null,
      broker: null,
      licence: null,
      groupservice: null,
      service_given_month: '0',
      parent_id: null,
      strategies: [],
      tomonth: null,
      todate: null,
      fromDate: null,
      app_id: 'null',
      api_type: 'null',
      client_code: 'null',
      api_key: 'null',
      api_secret: 'null',
      app_key: 'null',
      demat_userid: 'null',
      parent_role: null,
      Strategy: false
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
      // if (!values.licence) {
      //   errors.licence = valid_err.LICENCE_TYPE_ERROR;
      // }

      // if ((values.licence === "1" || values.licence === 1) && values.licence)

      // if (!values.tomonth) {
      //   errors.tomonth = valid_err.LICENCE_ERROR;
      // }

      if (!values.broker) {
        errors.broker = valid_err.BROKER_ERROR;
      }
      if (!values.groupservice) {
        errors.groupservice = valid_err.GROUPSELECT_ERROR;
      }
      if (!values.Strategy) {
        errors.Strategy = "select test";
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
        "FullName": values.fullName,
        "UserName": values.username,
        "Email": values.email,
        "PhoneNo": values.mobile,
        "licence": values.tomonth,
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


      console.log("reqreqreqreqreq", req);

      // return

      await dispatch(Add_User({ req: req, token: user_token })).unwrap().then((res) => {
        console.log("response", res);

        // if (res.meta.requestStatus === "fulfilled") {
        //   if (res.payload === "Failed! Username is already in use!") {
        //     toast.error(res.payload)
        //   } else {
        //     toast.success(res.payload.data)
        //     // setshowLoader(false)
        //     // setshowLoader(false)
        //     setTimeout(() => {
        //       navigate("/admin/masters")
        //     }, 2000);
        //   }
        // }

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
    for (let index = 1; index < 3; index++) {
      Service_Month_Arr.push({ month: index, endDate: `${index} Month Licence Expired On ${new Date(new Date().getFullYear(), new Date().getMonth() + index, new Date().getDate()).toString().split('00:00:00')[0]}` })
    }
    console.log('Service_Month_Arr', Service_Month_Arr);
    setfirst(Service_Month_Arr)
  }, [])




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
        { label: '2 Days', value: '0' },
        { label: 'Demo', value: '1' },
        { label: 'Live', value: '2' },

      ],
    },
    {
      name: 'tomonth',
      label: 'To Month',
      type: 'select',
      options: first && first.map((item) => ({ label: item.endDate, value: item.month })),
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
      options:
        AllGroupServices.data && AllGroupServices.data.map((item) => ({ label: item.name, value: item._id }))
      ,
      // showWhen: values => values.licence === '2'
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
      ],


    },

    {
      name: 'parent_id',
      label: 'Sub-Admin',
      type: 'select',
      options: Addsubadmin.data && Addsubadmin.data.map((item) => ({ label: item.FullName, value: item._id }))
    },
    {
      name: 'Strategy', label: 'Strategy', type: 'checkbox',
    },

  ];

// console.log("fields" ,fields);

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
      formik.setFieldValue('fromdate', 'null');
      formik.setFieldValue('todate', 'null');
    }
    if (formik.values.licence === '1' || formik.values.licence === 1) {
      formik.setFieldValue('tomonth', 'null');

    }

  }, [formik.values.broker]);






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
      console.log("response", response);
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
      <Content Page_title="Add Client" button_title='Back' route="/admin/allclients">
        <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Master"
          fromDate={formik.values.fromDate}
          toDate={formik.values.todate}
          additional_field={
            <>
              {formik.values.Strategy ? <>
                {AllStrategy.data.map((strategy) => (
                  <div className={`col-lg-2 mt-2`} key={strategy._id}>
                    <div className="row d-flex">
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
            </>

          }

        />
        {/* <div id="app-cover">
          <div class="row">
            <div class="toggle-button-cover">
              <div class="button-cover">
                <div class="button r" id="button-1">
                  <input type="checkbox" class="checkbox" />
                  <div class="knobs"></div>
                  <div class="layer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
          <label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
        </div> */}
      </Content >

    </>
  )
}


export default AddClient

