
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
const EditStrategyNormal = () => {
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
   
      segment: "",
    
      strategy_description: "",
    
    },
    touched: {
      strategyname: false,
     
      segment: false,
  
      strategy_description: false,
      
    },
    validate: (values) => {
      const errors = {};
      if (!values.strategyname && formik.touched.strategyname) {
        errors.strategyname = valid_err.EMPTY_STRATEGY_NAME_ERR;
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
       
        'strategy_segment': values.segment,
        'strategy_description': values.strategy_description,
       
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
  
    { name: 'strategy_description', label: 'Strategy Description', type: 'msgbox', row_size: 7, label_size: 6, col_size: 6, disable: false },

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
    
          formik.setFieldValue("segment", response.data.strategy_segment);
      
          formik.setFieldValue("strategy_description", response.data.strategy_description);
     

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
          btn_name="Edit Strategy"
          title="EditStrategy"

        />
        <ToastButton />

        
      </Content>
    </>
  );
};

export default EditStrategyNormal;
