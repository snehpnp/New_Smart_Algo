/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars

import React, { useEffect, useState } from 'react'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import * as  valid_err from "../../../../Utils/Common_Messages"
// import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { No_Negetive_Input_regex } from "../../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import Content from '../../../../Components/Dashboard/Content/Content';
import { Get_All_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice'

import { Get_Strategy_BY_Id } from '../../../../ReduxStore/Slice/Admin/StrategySlice';


const EditStrategy = () => {

    const user_token = JSON.parse(localStorage.getItem("user_details")).token
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    // const AdminToken = JSON.parse(localStorage.getItem('user_details')).accessToken;
    const [CatagoryData, setCatagoryData] = useState({
        loading: true,
        data: []
    });

    const [one_strategy, setone_strategy] = useState('')

    const NoOnlyRegex = (value) => {
        return No_Negetive_Input_regex(value)
    }



    const formik = useFormik({
        initialValues: {
            strategyname: '',
            perlot: '',
            Catagory: '',
            segment: '',
            indecator: 'null',
            strategytester: 'null',
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

            alert("helo")
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

            //   await dispatch(EditStrategys({ req: req, AdminToken: AdminToken })).then((res) => {


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
                console.log("Get_All_Catagory", response);
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

    const [indicatorPreview, setIndicatorPreview] = useState(null);
const [testerPreview, setTesterPreview] = useState(null);

    console.log("hello", formik.values);

    const get_strategy_BY_did = async () => {
        await dispatch(Get_Strategy_BY_Id({
            _id: id
            , token: user_token
        })).unwrap()
            .then((response) => {
                if (response.status) {
                    console.log("response.data.", response.data);
                    setone_strategy(response.data);
                    formik.setFieldValue('strategyname', response.data.strategy_name);
                    formik.setFieldValue('perlot', response.data.strategy_amount);
                    formik.setFieldValue('Catagory', response.data.strategy_category);
                    formik.setFieldValue('segment', response.data.strategy_segment);
                    formik.setFieldValue('indecator', response.data.strategy_indicator);
                    formik.setFieldValue('strategytester', response.data.strategy_tester);
                    formik.setFieldValue('strategy_description', response.data.strategy_description);
                    setIndicatorPreview(response.data.strategy_indicator);
                setTesterPreview(response.data.strategy_tester);
                }
            })
    }
    useEffect(() => {
        get_strategy_BY_did()
    }, [id])







    return (
        <>
            <Content Page_title="Edit Strategy " button_title="Back" route="/admin/strategies">
                <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Strategy" title='EditStrategy' />
                {/* {indicatorPreview && (
                    <img src={indicatorPreview} alt="Indicator Preview" />
                )}
                {testerPreview && (
                    <img src={testerPreview} alt="Tester Preview" />
                )} */}
            </Content >

        </>
    )
}


export default EditStrategy

