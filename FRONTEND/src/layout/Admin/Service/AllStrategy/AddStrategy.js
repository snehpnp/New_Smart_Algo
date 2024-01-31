/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form1"
import { useFormik } from 'formik';
import * as  valid_err from "../../../../Utils/Common_Messages"
// import { toast } from "react-toastify";
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import { No_Negetive_Input_regex, Yearly_plan_regex, Halfyearly_plan_regex, Quaterly_plan_regex, Monthly_plan_regex } from "../../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import Content from '../../../../Components/Dashboard/Content/Content';
import { Get_All_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import toast, { Toaster } from 'react-hot-toast';

import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";

import { Add_Strategy } from '../../../../ReduxStore/Slice/Admin/StrategySlice';
// import "../../../component/admin/admin-assets/css/style.css"


// import { AddStrategys } from "../../../ReduxStore/Slice/AdminMasters"



const AddStrategy = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const AdminToken = JSON.parse(localStorage.getItem('user_details')).token;
    const [CatagoryData, setCatagoryData] = useState({ loading: true, data: [] });
    const [refresh, setRefresh] = useState(false);

    const [SelectPlan, setSelectPlan] = useState(true);
    const [SelectPlanArr, setSelectPlanArr] = useState([]);

    const [strategy_amount_month, setStrategy_amount_month] = useState('');
    const [strategy_amount_quarterly, setStrategy_amount_quarterly] = useState('');
    const [strategy_amount_half_early, setStrategy_amount_half_early] = useState('');
    const [strategy_amount_early, setStrategy_amount_early] = useState('');








    const NoOnlyRegex = (value) => {
        return No_Negetive_Input_regex(value);
    }
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
            strategyname: '',
            perlot: '',
            Catagory: '',
            segment: '',
            indecator: '',
            strategytester: '',
            strategy_description: '',
            starategylogo: '',
            monthly_plan: '',
            quaterly_plan: '',
            halfyearly_plan: '',
            yearly_plan: ''
        },
        validate: (values) => {
            const errors = {};
            if (!values.strategyname) {
                errors.strategyname = valid_err.EMPTY_STRATEGY_NAME_ERR;
            }
            if (!values.monthly_plan) {
                errors.monthly_plan = valid_err.EMPTY_MONTHLY_PLAN_ERR;
            }
            else if (!isValidMonthlyPlan(values.monthly_plan)) {
                errors.monthly_plan = valid_err.VALID_MONTHLY_PLAN_ERR;
            }
            if (!values.quaterly_plan) {
                errors.quaterly_plan = valid_err.EMPTY_QUATERLY_PLAN_ERR;
            }
            else if (!isValidQuarterlyPlan(values.quaterly_plan)) {
                errors.quaterly_plan = valid_err.VALID_QUATERLY_PLAN_ERR;
            }
            if (!values.halfyearly_plan) {
                errors.halfyearly_plan = valid_err.EMPTY_HALFYEARLY_PLAN_ERR;
            }
            else if (!isValidHalfyearlyPlan(values.halfyearly_plan)) {
                errors.halfyearly_plan = valid_err.VALID_HALFYEARLY_PLAN_ERR;
            }
            if (!values.yearly_plan) {
                errors.yearly_plan = valid_err.EMPTY_YEARLY_PLAN_ERR;
            }
            else if (!isValidYearlyPlan(values.yearly_plan)) {
                errors.yearly_plan = valid_err.VALID_YEARLY_PLAN_ERR;
            }
            if (!values.perlot) {
                errors.perlot = valid_err.EMPTY_STRATEGY_LOT_ERR;
            } else if (!NoOnlyRegex(values.perlot)) {
                errors.perlot = valid_err.VALID_STRATEGY_LOT_ERR;
            }
            if (!values.Catagory) {
                errors.Catagory = valid_err.EMPTY_STRATEGY_CATAGORY_ERR;
            }
            if (!values.segment) {
                errors.segment = valid_err.EMPTY_STRATEGY_SEGMENT_ERR;
            }
            if (!values.strategy_description) {
                errors.strategy_description = valid_err.EMPTY_STRATEGY_DESCRIPTION_ERR;
            }


            return errors;
        },
        onSubmit: async (values) => {

            const req = {
                "strategy_name": values.strategyname,
                "strategy_amount": values.perlot,
                "strategy_category": values.Catagory,
                "strategy_indicator": values.indecator,
                "strategy_tester": values.strategytester,
                "strategy_segment": values.segment,
                "strategy_description": values.strategy_description,
                "strategy_amount_month": values.monthly_plan,
                "strategy_amount_quarterly": values.quaterly_plan,
                "strategy_amount_half_early": values.halfyearly_plan,
                "strategy_image": values.starategylogo,
                "strategy_amount_early": values.yearly_plan,
                "plans": SelectPlanArr
            }
          

            await dispatch(Add_Strategy({ req: req, token: AdminToken })).unwrap().then((response) => {
                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                   
                    toast.success(response.msg);
                    setTimeout(() => {
                        navigate("/admin/strategies")
                    }, 1000);
                }

            })
        }
    });



    const fields = [
        { name: 'strategyname', label: 'Strategy Name', type: 'text', label_size: 12, col_size: 6, disable: false },
        { name: 'perlot', label: 'Per Lot Amount', type: 'text', label_size: 12, col_size: 6, disable: false },
        { name: 'Catagory', label: 'catagory', type: 'text', label_size: 12, col_size: 6, disable: false },
        {
            name: 'segment',
            label: 'Select Segment',
            type: 'select',
            options: CatagoryData.data && CatagoryData.data.map((item) => ({ label: item.name, value: item.segment })),
            label_size: 12, col_size: 6, disable: false
        },
        { name: 'indecator', label: 'Indicator ', type: 'file', label_size: 12, col_size: 6, disable: false },
        { name: 'strategytester', label: 'Strategy Tester ', type: 'file', label_size: 12, col_size: 6, disable: false },
        { name: 'starategylogo', label: 'Strategy Logo ', type: 'file', label_size: 6, col_size: 6, disable: false },
        { name: 'strategy_description', label: 'Strategy description', type: 'msgbox', row_size: 7, label_size: 6, col_size: 6, disable: false },
        { name: 'monthly_plan', label: 'Monthly', type: 'text', row_size: 3, label_size: 4, col_size: 3, disable: false },
        { name: 'quaterly_plan', label: 'Quaterly', type: 'text', row_size: 3, label_size: 4, col_size: 3, disable: false },
        { name: 'halfyearly_plan', label: 'Half Yearly', type: 'text', row_size: 3, label_size: 4, col_size: 3, disable: false },
        { name: 'yearly_plan', label: 'Yearly', type: 'text', row_size: 3, label_size: 4, col_size: 3, disable: false },



    ];


    const getservice = async () => {
        await dispatch(Get_All_Catagory()).unwrap()
            .then((response) => {

                if (response.status) {
                    setCatagoryData({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        getservice()
    }, [])

 


    return (
        <>
            <Content Page_title="Add Strategy " button_title="Back" route="/admin/strategies">
                <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Strategy" title='addstrategy'
                />
                < ToastButton />
            </Content >

        </>
    )
}


export default AddStrategy

