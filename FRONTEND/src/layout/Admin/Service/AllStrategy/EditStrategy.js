// /* eslint-disable react/jsx-pascal-case */
// /* eslint-disable react-hooks/exhaustive-deps */
// // eslint-disable-next-line no-unused-vars

// import React, { useEffect, useState } from 'react'
// import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
// import { useFormik } from 'formik';
// import * as  valid_err from "../../../../Utils/Common_Messages"
// // import { toast } from "react-toastify";
// import { useNavigate, useParams ,useLocation } from "react-router-dom";
// import { No_Negetive_Input_regex } from "../../../../Utils/Common_regex"
// import { useDispatch, useSelector } from "react-redux";
// import Content from '../../../../Components/Dashboard/Content/Content';
// import { Get_All_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
// import toast, { Toaster } from 'react-hot-toast';
// import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";

// import { Get_Strategy_BY_Id, Edit_Strategy } from '../../../../ReduxStore/Slice/Admin/StrategySlice';

// const EditStrategy = () => {

//     const user_token = JSON.parse(localStorage.getItem("user_details")).token
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const location = useLocation()
//     const { id } = useParams()
//     // const AdminToken = JSON.parse(localStorage.getItem('user_details')).accessToken;
//     const [CatagoryData, setCatagoryData] = useState({
//         loading: true,
//         data: []
//     });

//     const [one_strategy, setone_strategy] = useState('')

//     const NoOnlyRegex = (value) => {
//         return No_Negetive_Input_regex(value)
//     }

//     const get_strategy_BY_did = async () => {
//         await dispatch(Get_Strategy_BY_Id({
//             _id: id
//             , token: user_token
//         })).unwrap()
//             .then((response) => {
//                 if (response.status) {
//                     setone_strategy(response.data);
//                     // formik.setFieldValue('strategyname', response.data.strategy_name);
//                     // formik.setFieldValue('perlot', response.data.strategy_amount);
//                     // formik.setFieldValue('Catagory', response.data.strategy_category);
//                     // formik.setFieldValue('segment', response.data.strategy_segment);
//                     // formik.setFieldValue('indecator', response.data.strategy_indicator);
//                     // formik.setFieldValue('strategytester', response.data.strategy_tester);
//                     // formik.setFieldValue('strategy_description', response.data.strategy_description);
//                     // setIndicatorPreview(response.data.strategy_indicator);
//                     // setTesterPreview(response.data.strategy_tester);
//                 }
//             })
//     }
//     useEffect(() => {
//         get_strategy_BY_did()
//     }, [id])

//     const formik = useFormik({
//         initialValues: {
//             strategyname: location.state && location.state.strategy_name ,
//             perlot: location.state && location.state.strategy_amount,
//             Catagory:location.state && location.state.strategy_category,
//             segment: location.state && location.state.strategy_segment ,
//             indecator: location.state && location.state.strategy_indicator,
//             strategytester: location.state && location.state.strategy_tester,
//             strategy_description: location.state && location.state.strategy_description

//         },
//         validate: (values) => {
//             const errors = {};
//             if (!values.strategyname) {
//                 errors.strategyname = valid_err.EMPTY_STRATEGY_NAME_ERR;
//             }
//             if (!values.perlot) {
//                 errors.perlot = valid_err.EMPTY_STRATEGY_LOT_ERR;
//             } else if (!NoOnlyRegex(values.perlot)) {
//                 errors.perlot = valid_err.VALID_STRATEGY_LOT_ERR;
//             }
//             if (!values.Catagory) {
//                 errors.Catagory = valid_err.EMPTY_STRATEGY_CATAGORY_ERR;
//             }
//             if (!values.segment) {
//                 errors.segment = valid_err.EMPTY_STRATEGY_SEGMENT_ERR;
//             }
//             if (!values.strategy_description) {
//                 errors.strategy_description = valid_err.EMPTY_STRATEGY_DESCRIPTION_ERR;
//             }

//             return errors;
//         },
//         onSubmit: async (values) => {

//             // alert("helo")
//             const req = {
//                 "_id": id,
//                 "strategy_name": values.strategyname,
//                 "strategy_description": values.strategy_description,
//                 "strategy_category": values.Catagory,
//                 "strategy_segment": values.segment,
//                 "strategy_indicator": values.indecator,
//                 "strategy_tester": values.strategytester,
//                 "strategy_amount": values.perlot,
//             }

//             // return

//             await dispatch(Edit_Strategy({ req: req, token: user_token })).unwrap().then((response) => {
//                 if (response.status === 409) {
//                     toast.error(response.data.msg);
//                 }
//                 else if (response.status) {
//                     toast.success(response.msg);
//                     setTimeout(() => {
//                         navigate("/admin/strategies")
//                     }, 1000);
//                 }
//             })
//         }
//     });

//     const fields = [
//         { name: 'strategyname', label: 'Strategy Name', type: 'text' },
//         { name: 'perlot', label: 'Per Lot Amount', type: 'text' },
//         { name: 'Catagory', label: 'catagory', type: 'text' },

//         {
//             name: 'segment',
//             label: 'Select Segment',
//             type: 'select',
//             options: CatagoryData.data && CatagoryData.data.map((item) => ({ label: item.name, value: item.segment }))

//         },
//         { name: 'indecator', label: 'Indicator ', type: 'file' },
//         { name: 'strategytester', label: 'Stratergy Tester ', type: 'file' },
//         { name: 'strategy_description', label: 'Strategy Description', type: 'msgbox' },

//     ];

//     const getservice = async () => {
//         await dispatch(Get_All_Catagory()).unwrap()
//             .then((response) => {
//                 if (response.status) {
//                     setCatagoryData({
//                         loading: false,
//                         data: response.data
//                     });
//                 }
//             })
//     }
//     useEffect(() => {
//         getservice()
//     }, [])

//     return (
//         <>
//             <Content Page_title="Update" button_title="Back" route="/admin/strategies">
//                 <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Strategy" title='EditStrategy' />
//                 {/* {indicatorPreview && (
//                     <img src={indicatorPreview} alt="Indicator Preview" />
//                 )}
//                 {testerPreview && (
//                     <img src={testerPreview} alt="Tester Preview" />
//                 )} */}

//                 <ToastButton />

//             </Content >

//         </>
//     )
// }

// export default EditStrategy

/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars

import React, { useEffect, useState } from "react";
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form1";
import { useFormik } from "formik";
import * as valid_err from "../../../../Utils/Common_Messages";
// import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { No_Negetive_Input_regex } from "../../../../Utils/Common_regex";
import { useDispatch, useSelector } from "react-redux";
import Content from "../../../../Components/Dashboard/Content/Content";
import { Get_All_Catagory } from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import {
  Get_Strategy_BY_Id,
  Edit_Strategy,
} from "../../../../ReduxStore/Slice/Admin/StrategySlice";
import toast, { Toaster } from "react-hot-toast";
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
const EditStrategy = () => {
  const user_token = JSON.parse(localStorage.getItem("user_details")).token;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [CatagoryData, setCatagoryData] = useState({
    loading: true,
    data: [],
  });

  const [one_strategy, setone_strategy] = useState("");

  const NoOnlyRegex = (value) => {
    return No_Negetive_Input_regex(value);
  };

  const formik = useFormik({
    initialValues: {
      strategyname: "",
      perlot: "",
      Catagory: "",
      segment: "",
      indecator: "null",
      strategytester: "null",
      strategy_description: "",
    },
    touched: {
      strategyname: false,
      perlot: false,
      Catagory: false,
      segment: false,
      indecator: false,
      strategytester: false,
      strategy_description: false,
    },
    validate: (values) => {
      const errors = {};
      if (!values.strategyname && formik.touched.strategyname) {
        errors.strategyname = valid_err.EMPTY_STRATEGY_NAME_ERR;
      }
      if (!values.perlot && formik.touched.perlot) {
        errors.perlot = valid_err.EMPTY_STRATEGY_LOT_ERR;
      } else if (!NoOnlyRegex(values.perlot) && formik.touched.perlot) {
        errors.perlot = valid_err.VALID_STRATEGY_LOT_ERR;
      }
      if (!values.Catagory && formik.touched.Catagory) {
        errors.Catagory = valid_err.EMPTY_STRATEGY_CATAGORY_ERR;
      }
      if (!values.segment && formik.touched.segment) {
        errors.segment = valid_err.EMPTY_STRATEGY_SEGMENT_ERR;
      }
      if (!values.strategy_description && formik.touched.strategy_description) {
        errors.strategy_description = valid_err.EMPTY_STRATEGY_DESCRIPTION_ERR;
      }

      return errors;
    },
    onSubmit: async (values) => {
      // alert("helo")

      const req = {
        _id: id,
        strategy_name: values.strategyname,
        strategy_amount: values.perlot,
        strategy_category: values.Catagory,
        strategy_indicator: values.indecator,
        strategy_tester: values.strategytester,
        strategy_segment: values.segment,
        strategy_description: values.strategy_description,
      };

      await dispatch(Edit_Strategy({ req: req, token: user_token }))
        .unwrap()
        .then((response) => {
          if (response.status === 409) {
            toast.error(response.data.msg);
          } else if (response.status) {
            toast.success(response.msg);
            setTimeout(() => {
              navigate("/admin/strategies");
            }, 1000);
          }
        });
    },
  });

  const fields = [
    {
      name: "strategyname",
      label: "Strategy Name",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "perlot",
      label: "Per Lot Amount",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "Catagory",
      label: "catagory",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "segment",
      label: "Select Segment",
      type: "select",
      options:
        CatagoryData.data &&
        CatagoryData.data.map((item) => ({
          label: item.name,
          value: item.segment,
        })),
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "indecator",
      label: "Indicator ",
      type: "file",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "strategytester",
      label: "Strategy Tester ",
      type: "file",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "strategy_description",
      label: "Strategy Description",
      type: "msgbox",
      row_size: 4,
      label_size: 12,
      col_size: 12,
      disable: false,
    },
  ];

  console.log("test", formik.values);

  const getservice = async () => {
    await dispatch(Get_All_Catagory())
      .unwrap()
      .then((response) => {
        console.log("Get_All_Catagory", response);
        if (response.status) {
          setCatagoryData({
            loading: false,
            data: response.data,
          });
        }
      });
  };
  useEffect(() => {
    getservice();
  }, []);

  const get_strategy_BY_did = async () => {
    await dispatch(
      Get_Strategy_BY_Id({
        _id: id,
        token: user_token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          console.log("response", response);
          setone_strategy(response.data);
          formik.setFieldValue("strategyname", response.data.strategy_name);
          formik.setFieldValue("perlot", response.data.strategy_amount);
          formik.setFieldValue("Catagory", response.data.strategy_category);
          formik.setFieldValue("segment", response.data.strategy_segment);
          formik.setFieldValue("indecator", response.data.strategy_indicator);
          formik.setFieldValue("strategytester", response.data.strategy_tester);
          formik.setFieldValue(
            "strategy_description",
            response.data.strategy_description
          );
        }
      });
  };
  useEffect(() => {
    get_strategy_BY_did();
  }, [id]);

  return (
    <>
      <Content
        Page_title="Edit Strategy "
        button_title="Back"
        route="/admin/strategies"
      >
        <Formikform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name="Add Strategy"
          title="EditStrategy"
        />
        <ToastButton />

        {/* {indicatorPreview && (
                    <img src={indicatorPreview} alt="Indicator Preview" />
                )}
                {testerPreview && (
                    <img src={testerPreview} alt="Tester Preview" />
                )} */}
      </Content>
    </>
  );
};

export default EditStrategy;
