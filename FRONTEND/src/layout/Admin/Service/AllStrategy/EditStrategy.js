
import React, { useEffect, useState } from "react";
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form1";
import { useFormik } from "formik";
import * as valid_err from "../../../../Utils/Common_Messages";
// import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { No_Negetive_Input_regex, Yearly_plan_regex, Halfyearly_plan_regex, Quaterly_plan_regex, Monthly_plan_regex } from "../../../../Utils/Common_regex"
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

  const [SelectPlan, setSelectPlan] = useState(true);
  const [SelectPlanArr, setSelectPlanArr] = useState([]);


  const [strategy_amount_month, setStrategy_amount_month] = useState('');
  const [strategy_amount_quarterly, setStrategy_amount_quarterly] = useState('');
  const [strategy_amount_half_early, setStrategy_amount_half_early] = useState('');
  const [strategy_amount_early, setStrategy_amount_early] = useState('');


  const NoOnlyRegex = (value) => {
    return No_Negetive_Input_regex(value);
  };


  const isValidMonthlyPlan = (month) => {
    return Monthly_plan_regex(month);
  }
  const isValidQuarterlyPlan = (quaterly) => {
    return Quaterly_plan_regex(quaterly);
  }
  const isValidHalfyearlyPlan = (halfyearly) => {
    return Halfyearly_plan_regex(halfyearly);
  }
  const isValidYearlyPlan = (yearly) => {
    return Yearly_plan_regex(yearly);
  }

  const formik = useFormik({
    initialValues: {
      strategyname: "",
      perlot: "",
      Catagory: "",
      segment: "",
      indecator: "null",
      strategytester: "null",
      strategy_description: "",
      starategylogo: "",
      monthly_plan: '',
      quaterly_plan: '',
      halfyearly_plan: '',
      yearly_plan: ''
    },
    touched: {
      strategyname: false,
      perlot: false,
      Catagory: false,
      segment: false,
      indecator: false,
      strategytester: false,
      strategy_description: false,
      starategylogo: false,
      monthly_plan: false,
      quaterly_plan: false,
      halfyearly_plan: false,
      yearly_plan: false
    },
    validate: (values) => {
      const errors = {};
      if (!values.strategyname && formik.touched.strategyname) {
        errors.strategyname = valid_err.EMPTY_STRATEGY_NAME_ERR;
      }
      

      if (!values.monthly_plan && formik.touched.monthly_plan) {
        errors.monthly_plan = valid_err.EMPTY_MONTHLY_PLAN_ERR;
      }
      else if (!isValidMonthlyPlan(values.monthly_plan) && formik.touched.monthly_plan) {
        errors.monthly_plan = valid_err.VALID_MONTHLY_PLAN_ERR;
      }
      if (!values.quaterly_plan && formik.touched.quaterly_plan) {
        errors.quaterly_plan = valid_err.EMPTY_QUATERLY_PLAN_ERR;
      }
      else if (!isValidQuarterlyPlan(values.quaterly_plan) && formik.touched.quaterly_plan) {
        errors.quaterly_plan = valid_err.VALID_QUATERLY_PLAN_ERR;
      }
      if (!values.halfyearly_plan && formik.touched.halfyearly_plan) {
        errors.halfyearly_plan = valid_err.EMPTY_HALFYEARLY_PLAN_ERR;
      }
      else if (!isValidHalfyearlyPlan(values.halfyearly_plan) && formik.touched.halfyearly_plan) {
        errors.halfyearly_plan = valid_err.VALID_HALFYEARLY_PLAN_ERR;
      }
      if (!values.yearly_plan && formik.touched.yearly_plan) {
        errors.yearly_plan = valid_err.EMPTY_YEARLY_PLAN_ERR;
      }
       else if (!isValidYearlyPlan(values.yearly_plan) && formik.touched.yearly_plan) {
        errors.yearly_plan = valid_err.VALID_YEARLY_PLAN_ERR;
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

      const req = {
        _id: id,
        'strategy_name': values.strategyname,
        'strategy_amount': values.perlot,
        'strategy_category': values.Catagory,
        'strategy_indicator': values.indecator,
        'strategy_tester': values.strategytester,
        'strategy_segment': values.segment,
        'strategy_description': values.strategy_description,
        "strategy_amount_month": values.monthly_plan,
        "strategy_amount_quarterly": values.quaterly_plan,
        "strategy_amount_half_early": values.halfyearly_plan,
        "strategy_image": values.starategylogo,
        "strategy_amount_early": values.yearly_plan,
        "plans": SelectPlanArr
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
    { name: 'starategylogo', label: 'Strategy Logo ', type: 'file', label_size: 6, col_size: 6, disable: false },
    { name: 'strategy_description', label: 'Strategy Description', type: 'msgbox', row_size: 7, label_size: 6, col_size: 6, disable: false },
    { name: 'monthly_plan', label: 'Monthly', type: 'text', row_size: 3, label_size: 4, col_size: 3, disable: false },
    { name: 'quaterly_plan', label: 'Quaterly', type: 'text', row_size: 3, label_size: 4, col_size: 3, disable: false },
    { name: 'halfyearly_plan', label: 'Half Yearly', type: 'text', row_size: 3, label_size: 4, col_size: 3, disable: false },
    { name: 'yearly_plan', label: 'Yearly', type: 'text', row_size: 3, label_size: 4, col_size: 3, disable: false },
  ];


  const getservice = async () => {
    await dispatch(Get_All_Catagory())
      .unwrap()
      .then((response) => {
        // console.log("Get_All_Catagory", response);
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
        // console.log("response :",response)

        if (response.status) {
          setone_strategy(response.data);
          formik.setFieldValue("strategyname", response.data.strategy_name);
          formik.setFieldValue("perlot", response.data.strategy_amount);
          formik.setFieldValue("Catagory", response.data.strategy_category);
          formik.setFieldValue("segment", response.data.strategy_segment);
          formik.setFieldValue("indecator", response.data.strategy_indicator);
          formik.setFieldValue("strategytester", response.data.strategy_tester);
          formik.setFieldValue("starategylogo", response.data.strategy_image);
          formik.setFieldValue("strategy_description", response.data.strategy_description);
          formik.setFieldValue("monthly_plan", response.data.strategy_amount_month);
          formik.setFieldValue("quaterly_plan", response.data.strategy_amount_quarterly);
          formik.setFieldValue("halfyearly_plan", response.data.strategy_amount_half_early);
          formik.setFieldValue("yearly_plan", response.data.strategy_amount_early);

        }
      });
  };
  useEffect(() => {
    get_strategy_BY_did();
  }, [id]);



  // const SelectPlanValues = (name, value) => {
  //   setSelectPlanArr((prev) => {
  //     const index = prev.findIndex((obj) => obj.type === name);

  //     if (index !== -1) {
  //       prev[index] = { type: name, price: value };
  //     } else {
  //       prev.push({ type: name, price: value });
  //     }

  //     return [...prev];
  //   });
  // }
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
          btn_name="Edit Strategy"
          title="EditStrategy"

        // additional_field={
        //   <>
        //     <div className='row'>
        //       <div className="col-12">
        //         {/* <h6>Select Plans</h6> */}
        //         <div class="form-check">
        //           <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={() => setSelectPlan(!SelectPlan)} />
        //           <label class="form-check-label" for="flexCheckDefault">
        //             Select Plans
        //           </label>
        //         </div>
        //       </div>
        //       {SelectPlan ? <>
        //         <div className={`col-lg-3`}>
        //           <div className="mb-3 row flex-column">
        //             <label
        //               className={`col-lg-4`}
        //               htmlFor="Monthly"
        //             >
        //               Monthly
        //               <span className="text-danger">*</span>
        //             </label>
        //             <div
        //             >
        //               <input
        //                 type="text"
        //                 className="form-control"
        //                 id='Monthly'
        //                 placeholder={`Enter A Monthly Plan Amount`}
        //                 onChange={(e) => { SelectPlanValues("monthly", e.target.value); setStrategy_amount_month(e.target.value) }}
        //                 value={strategy_amount_month}

        //               />
        //               <div className="invalid-feedback">
        //                 Enter A Monthly Plan Amount
        //               </div>
        //             </div>
        //           </div>
        //         </div>
        //         <div className={`col-lg-3`}>
        //           <div className="mb-3 row flex-column">
        //             <label
        //               className={`col-lg-4`}
        //               htmlFor="Quaterly"
        //             >
        //               Quaterly
        //               <span className="text-danger">*</span>
        //             </label>
        //             <div
        //             >
        //               <input
        //                 type="text"
        //                 className="form-control"
        //                 id='Quaterly'
        //                 placeholder={`Enter A Quaterly Plan Amount`}
        //                 onChange={(e) => { SelectPlanValues("quaterly", e.target.value); setStrategy_amount_quarterly(e.target.value) }}
        //                 value={strategy_amount_quarterly}


        //               />
        //               <div className="invalid-feedback">
        //                 Enter A Quaterly Plan Amount
        //               </div>

        //             </div>
        //           </div>
        //         </div>
        //         <div className={`col-lg-3`}>
        //           <div className="mb-3 row flex-column">
        //             <label
        //               className={`col-lg-4`}
        //               htmlFor="monthly"
        //             >
        //               monthly
        //               <span className="text-danger">*</span>
        //             </label>
        //             <div
        //             >
        //               <input
        //                 type="text"
        //                 className="form-control"
        //                 id='Half-Yearly'
        //                 placeholder={`Enter a Half-Yearly Plan Value`}
        //                 onChange={(e) => { SelectPlanValues("halfyearly", e.target.value); setStrategy_amount_half_early(e.target.value) }}
        //                 value={strategy_amount_half_early}


        //               />
        //               <div className="invalid-feedback">
        //                 Enter A Half-Yearly Plan Amount
        //               </div>

        //             </div>
        //           </div>
        //         </div>
        //         <div className={`col-lg-3`}>
        //           <div className="mb-3 row flex-column">
        //             <label
        //               className={`col-lg-4`}
        //               htmlFor="Yearly"
        //             >
        //               Yearly
        //               <span className="text-danger">*</span>
        //             </label>
        //             <div
        //             >
        //               <input
        //                 type="text"
        //                 className="form-control"
        //                 id='Yearly'
        //                 placeholder={`Enter a Yearly Plan Value`}
        //                 onChange={(e) => { SelectPlanValues("yearly", e.target.value); setStrategy_amount_early(e.target.value) }}
        //                 value={strategy_amount_early}

        //               />
        //               <div className="invalid-feedback">
        //                 Please enter a Yearly Plan Value
        //               </div>
        //             </div>
        //           </div>
        //         </div>
        //       </> : ""}
        //     </div>
        //   </>
        // }
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
