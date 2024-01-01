/* eslint-disable react-hooks/exhaustive-deps */
// import React from 'react'

import React, { useEffect, useState } from "react";
import Loader from "../../../../Utils/Loader";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Content from "../../../../Components/Dashboard/Content/Content";
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form1";
import * as valid_err from "../../../../Utils/Common_Messages";
import {
  Email_regex,
  Mobile_regex,
  Name_regex,
} from "../../../../Utils/Common_regex";

import { useFormik } from "formik";
import { Get_All_SUBADMIN } from "../../../../ReduxStore/Slice/Subadmin/Subadminslice";
import { Add_Subadmin } from "../../../../ReduxStore/Slice/Admin/CreateSubadminSlice";
import { useDispatch, useSelector } from "react-redux";
import { Get_All_Service_for_Client } from "../../../../ReduxStore/Slice/Common/commoSlice";
import { GET_ALL_GROUP_SERVICES } from "../../../../ReduxStore/Slice/Admin/AdminSlice";

import toast, { Toaster } from "react-hot-toast";

import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";

const AllSubadmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user_token = JSON.parse(localStorage.getItem("user_details")).token;
  const Role = JSON.parse(localStorage.getItem("user_details")).Role;
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;

  const [first, setfirst] = useState("all");
  const [showModal, setshowModal] = useState(false);

  const [ShowAllStratagy, setShowAllStratagy] = useState(false);

  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [SelectedGroupServices, setSelectedGroupServices] = useState([]);

  console.log("SelectedGroupServices", SelectedGroupServices)

  const [Addsubadmin, setAddsubadmin] = useState({
    loading: false,
    data: [],
  });

  const [AllGroupServices, setAllGroupServices] = useState({
    loading: true,
    data: [],
  });

  const [AllStrategy, setAllStrategy] = useState({
    loading: true,
    data: [],
  });



  const [state, setstate] = useState([]);
  const [state1, setstate1] = useState([]);



  const isValidEmail = (email) => {
    return Email_regex(email);
  };
  const isValidContact = (mobile) => {
    return Mobile_regex(mobile);
  };

  const isValidName = (mobile) => {
    return Name_regex(mobile);
  };

  const formik = useFormik({
    initialValues: {
      FullName: "",
      username: "",
      email: "",
      mobile: "",
      password: "",
      Strategy: false,
      select_strategy: [],
      gotodashboard: false,
      licence: false,
      detailsinfo: false,
      all: false,
      editclient: false,
      addclient: false,
      tradehistory: false,
      updateapikeys: false,
      groupservice: false,
      select_group_services: [],
      group: false,
      grouper_servcice: "",
      strateg_servcice: ""
    },

    validate: (values) => {
      const errors = {};
      // if (!values.username) {
      //     errors.username = valid_err.USERNAME_ERROR;
      // }

      if (!values.FullName) {
        errors.FullName = valid_err.FULLNAME_ERROR;
      } else if (!isValidName(values.FullName)) {
        errors.FullName = valid_err.INVALID_ERROR;
      }
      if (!values.password) {
        errors.password = valid_err.PASSWORD_ERROR;
      }

      if (!values.mobile) {
        errors.mobile = valid_err.CONTACT_ERROR;
      } else if (!isValidContact(values.mobile)) {
        errors.mobile = valid_err.INVALID_CONTACT_ERROR;
      }
      if (!values.email) {
        errors.email = valid_err.EMPTY_EMAIL_ERROR;
      } else if (!isValidEmail(values.email)) {
        errors.email = valid_err.INVALID_EMAIL_ERROR;
      }

      // console.log("values.addclient", values.addclient)
      // console.log("values.editclient", values.editclient)

      // if (values.addclient ) {
      //   // If either "Add Client" or "Edit Client" is checked, enable "Group Service Permission"
      //   values.groupservice = true;
      // }

      // else if (!values.addclient && !values.editclient && values.groupservice) {
      //   // If "Group Service Permission" is checked without "Add Client" and "Edit Client", clear the checkbox
      //   values.groupservice = false;
      // }


      // if (
      //   (values.all || values.groupservice) &&
      //   SelectedGroupServices.length === 0
      // ) {
      //   errors.groupservice = "Group Select";
      // }

      // if (
      //   (values.all || values.groupservice) &&
      //   SelectedGroupServices.length === 0
      // ) {
      //   errors.groupservice = "Group Select";
      // }


      if (values.Strategy) {
        if (!values.addclient && !values.editclient) {
          errors.addclient = "select Add Client Also";
          errors.editclient = "select Edit Client Also";
        }
      }
      if (values.groupservice) {
        if (!values.addclient && !values.editclient) {
          errors.addclient = "select Add Client Also";
          errors.editclient = "select Edit Client Also";
        }
      }

      if ((values.addclient || values.editclient) && values.groupservice && state.length === 0) {
        errors.grouper_servcice = "You must select a Group Service from the list";
      }
      if ((values.addclient || values.editclient) && values.Strategy && state1.length === 0) {
        errors.strateg_servcice = "You must select a Strategy from the list";
      }

      return errors;
    },
    onSubmit: async (values) => {
      console.log("values", values);


      const req = {
        FullName: values.FullName,
        Email: values.email,
        PhoneNo: values.mobile,
        password: values.password,
        Role: "SUBADMIN",
        parent_role: Role,
        parent_id: user_id,
        Subadmin_permision_data: {
          client_add: values.addclient ? "1" : values.all ? "1" : values.updateapikeys ? "0" : "0",
          Update_Api_Key: values.updateapikeys ? "1" : values.all ? "1" : "0",
          client_edit: values.editclient ? "1" : values.all ? "1" : values.updateapikeys ? "0" : "0",
          license_permision: values.licence ? "1" : values.all ? "1" : values.updateapikeys ? "0" : "0",
          go_To_Dashboard: values.gotodashboard ? "1" : values.all ? "1" : values.updateapikeys ? "0" : "0",
          trade_history_old: values.tradehistory ? "1" : values.all ? "1" : values.updateapikeys ? "0" : "0",
          detailsinfo: values.detailsinfo ? "1" : values.all ? "1" : values.updateapikeys ? "0" : "0",
          strategy: state1,
          group_services: state,
        },
      };

      // console.log("test", req);
      // return

      await dispatch(Add_Subadmin({ req: req, token: user_token }))
        .unwrap()
        .then((response) => {
          if (response.status === 409) {
            toast.error(response.data.msg);
          } else if (response.status) {
            toast.success(response.msg);

            setTimeout(() => {
              navigate("/admin/allsubadmins");
            }, 1000);
          } else if (!response.status) {
            toast.error(response.msg);
          }
        });
    },
  });





  const fields = [
    // { name: 'username', label: 'Username', type: 'text', label_size: 12, col_size: 6, disable: true },
    {
      name: "FullName",
      label: "FullName",
      type: "text",
      label_size: 12,
      col_size: 6,
    },
    {
      name: "mobile",
      label: "Mobile",
      type: "text",
      label_size: 12,
      col_size: 6,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 6,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      label_size: 12,
      col_size: 6,
    },
    {
      name: "all",
      label: "All Permission",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
    },
    {
      name: "addclient",
      label: "Add Client",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.addclient ? true : false,
    },
    {
      name: "editclient",
      label: "Edit Client",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.editclient ? true : false,
    },
    {
      name: "licence",
      label: "Licence  Permission",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true: formik.values.all || formik.values.licence ? true : false,
    },
    {
      name: "gotodashboard",
      label: "Go To Dashboard",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.gotodashboard ? true : false,
    },
    {
      name: "tradehistory",
      label: "Trade History",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.tradehistory ? true : false,
    },
    {
      name: "detailsinfo",
      label: "Full Info View",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.detailsinfo ? true : false,
    },

    {
      name: "groupservice",
      label: "Group Service Permission",
      type: "checkbox",
      check_box_true:
        formik.values.all || formik.values.groupservice ? true : false,
      label_size: 12,
      col_size: 3,
    },

    {
      name: "Strategy",
      label: "Strategy Permission",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.Strategy ? true : false,
    },
    {
      name: "updateapikeys",
      label: "Update Client API Key",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true: formik.values.updateapikeys ? true : false,
    },
  ];

  const data = async () => {
    await dispatch(
      Get_All_Service_for_Client({
        req: {},
        token: user_token,
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
  };

  useEffect(() => {
    data();
  }, []);

  useEffect(() => {
    if (formik.values.all) {
      formik.setFieldValue("addclient", true);
      formik.setFieldValue("editclient", true);
      formik.setFieldValue("gotodashboard", true);
      formik.setFieldValue("licence", true);
      formik.setFieldValue("group", true);
      formik.setFieldValue("groupservice", true);
      formik.setFieldValue("Strategy", true);
      formik.setFieldValue("detailsinfo", true);
      formik.setFieldValue("tradehistory", true);

    } else {
      formik.setFieldValue("addclient", false);
      formik.setFieldValue("editclient", false);
      formik.setFieldValue("gotodashboard", false);
      formik.setFieldValue("licence", false);
      formik.setFieldValue("group", false);
      formik.setFieldValue("groupservice", false);
      formik.setFieldValue("Strategy", false);
      formik.setFieldValue("detailsinfo", false);
      formik.setFieldValue("tradehistory", false);
      formik.setFieldValue("all", false);
    }

  }, [formik.values.all]);

  useEffect(() => {

    if (formik.values.updateapikeys) {
      formik.setFieldValue("all", false);
      formik.setFieldValue("addclient", false);
      formik.setFieldValue("editclient", false);
      formik.setFieldValue("gotodashboard", false);
      formik.setFieldValue("licence", false);
      formik.setFieldValue("group", false);
      formik.setFieldValue("groupservice", false);
      formik.setFieldValue("Strategy", false);
      formik.setFieldValue("tradehistory", false);
    }
  }, [formik.values.updateapikeys, formik.values.all]);




  useEffect(() => {
    //  for uncheck update key

    if ((formik.values.addclient) || (formik.values.editclient) || (formik.values.Strategy) || (formik.values.groupservice) || (formik.values.detailsinfo) || (formik.values.tradehistory) || (formik.values.gotodashboard)) {
      formik.setFieldValue("updateapikeys", false);
      setstate([])
      setstate1([])
      return
    }


    if (formik.values.Strategy) {
      formik.setFieldValue("Strategy", true);
      return
    }
    if (formik.values.groupservice) {
      formik.setFieldValue("groupservice", true);
      return
    }

    if ((formik.values.addclient) || (formik.values.editclient)) {
      formik.setFieldValue("groupservice", true);
      formik.setFieldValue("Strategy", true);
      setstate([])
      setstate1([])
      return
    } else if (!formik.values.addclient) {
      formik.setFieldValue("groupservice", false);
      formik.setFieldValue("Strategy", false);
      formik.setFieldValue("strateg_servcice", '');
      formik.setFieldValue("grouper_servcice", '');
      setstate([])
      setstate1([])
    }
    else {
      formik.setFieldValue("groupservice", false);
      formik.setFieldValue("Strategy", false);
      setstate([])
      setstate1([])
      return

    }
  }, [formik.values.editclient, formik.values.addclient, formik.values.detailsinfo, formik.values.tradehistory, formik.values.gotodashboard, formik.values.Strategy, formik.values.groupservice]);





  const handleStrategyChange = (event) => {
    const strategyId = event.target.value;

    if (event.target.checked) {
      setstate1([...state1, strategyId]);
    } else {
      // Remove the strategyId from the state array
      setstate1(state1.filter((id) => id !== strategyId));
    }




    // if (event.target.checked) {
    //   // Add the selected strategy to the array
    //   setSelectedStrategies([...selectedStrategies, strategyId]);
    // } else {
    //   // Remove the deselected strategy from the array
    //   setSelectedStrategies(
    //     selectedStrategies.filter((strategy) => strategy.id !== strategyId)
    //   );
    // }
  };

  const handleGroupChange = (event) => {
    const strategyId = event.target.value;

    const strategyName = event.target.name; // Assuming the label contains the strategy name


    if (event.target.checked) {
      setstate([...state, strategyId]);
    } else {
      // Remove the strategyId from the state array
      setstate(state.filter((id) => id !== strategyId));
    }




    // if (event.target.checked) {
    //   // Add the selected strategy to the array
    //   setSelectedGroupServices([...SelectedGroupServices, strategyId]);
    // } else {
    //   // Remove the deselected strategy from the array
    //   setSelectedGroupServices(
    //     SelectedGroupServices.filter((strategy) => strategy.id !== strategyId)
    //   );
    // }

    // setSelectedGroupServices([...new Set(SelectedGroupServices)]);







  };


  useEffect(() => {
    if (state.length > 1) {
      formik.setFieldValue("grouper_servcice", "");
    }
    if (state1.length > 1) {
      formik.setFieldValue("grouper_servcice", "");
    }
  }, [state, state1]);


  return (
    <>
      {Addsubadmin.loading ? (
        <Loader />
      ) : (
        <>
          <Content
            Page_title="Add Sub-Admin"
            button_title="Back"
            route="/admin/allsubadmins"
          >
            <Formikform
              fieldtype={fields.filter((field) => !field.showWhen)}
              formik={formik}
              btn_name="Add Sub-Admin"
              additional_field={
                <>
                  {formik.values.groupservice ? (
                    <>
                      <h6>All Group Service</h6>
                      {AllGroupServices.data.map((strategy) => (
                        <div className={`col-lg-2 mt-2`} key={strategy._id}>
                          <div className="row ">
                            <div className="col-lg-12 ">
                              <div class="form-check custom-checkbox mb-3">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  name={strategy.name}
                                  value={strategy._id}
                                  onChange={(e) => handleGroupChange(e)}
                                />
                                <label
                                  className="form-check-label"
                                  for={strategy.name}
                                >
                                  {strategy.name}
                                </label>
                              </div>

                            </div>
                          </div>
                        </div>
                      ))}
                      {formik.errors.grouper_servcice && (
                        <div style={{ color: "red" }}>
                          {formik.errors.grouper_servcice}
                        </div>
                      )}
                    </>
                  ) : (
                    ""
                  )}

                  {/* {formik.values.Strategy ? (
                    <>
                      <h6>All Strategy</h6>
                      <label class="toggle mt-3">
                        <input
                          class="toggle-checkbox bg-primary"
                          type="checkbox"
                          onChange={(e) => {
                            setShowAllStratagy(e.target.checked);
                          }}
                          defaultChecked={formik.values.all}
                        />
                        <div
                          class={`toggle-switch ${ShowAllStratagy ? "bg-primary" : "bg-secondary"
                            }`}
                        ></div>
                        <span class="toggle-label">Show Strategy</span>
                      </label>

                    </>
                  ) : (
                    ""
                  )} */}

                  {/*  For Show All Strategy */}
                  {formik.values.Strategy || formik.values.all || formik.values.addclient || formik.values.editclient ? (
                    <>
                      <h6>All Strategy</h6>

                      {AllStrategy.data.map((strategy) => (
                        <div className={`col-lg-2 mt-2`} key={strategy._id}>
                          <div className="row ">
                            <div className="col-lg-12 ">
                              <div class="form-check custom-checkbox mb-3">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  name={strategy.strategy_name}
                                  value={strategy._id}
                                  onChange={(e) => handleStrategyChange(e)}

                                />
                                <label
                                  className="form-check-label"
                                  for={strategy.strategy_name}
                                >
                                  {strategy.strategy_name}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {formik.errors.strateg_servcice && (
                        <div style={{ color: "red" }}>
                          {formik.errors.strateg_servcice}
                        </div>
                      )}

                    </>
                  ) : (
                    ""
                  )}
                </>
              }
            />

            <ToastButton />
          </Content>
        </>
      )}
    </>
  );
};

export default AllSubadmin;
