/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import * as  valid_err from "../../../../Utils/Common_Messages"
// import { toast } from "react-toastify";
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex, No_Negetive_Input_regex } from "../../../../Utils/Common_regex"
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







    const NoOnlyRegex = (value) => {
        return No_Negetive_Input_regex(value)
    }





    const formik = useFormik({
        initialValues: {
            strategyname: '',
            perlot: '',
            Catagory: '',
            segment: '',
            indecator: '',
            strategytester: '',
            strategy_description: ''
        },
        validate: (values) => {
            const errors = {};
            if (!values.strategyname) {
                errors.strategyname = valid_err.EMPTY_STRATEGY_NAME_ERR;
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
        { name: 'strategyname', label: 'Strategy Name', type: 'text' },
        { name: 'perlot', label: 'Per Lot Amount', type: 'text' },
        { name: 'Catagory', label: 'catagory', type: 'text' },
        {
            name: 'segment',
            label: 'Select Segment',
            type: 'select',
            options: CatagoryData.data && CatagoryData.data.map((item) => ({ label: item.name, value: item.segment }))

        },
        { name: 'indecator', label: 'Indicator ', type: 'file' },
        { name: 'strategytester', label: 'Stratergy Tester ', type: 'file' },
        { name: 'strategy_description', label: 'Strategy Description', type: 'msgbox' },
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
                <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Strategy" title='addstrategy' />

                <ToastButton />
            </Content >

        </>
    )
}


export default AddStrategy

