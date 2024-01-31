/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form1"
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



const AddStraegyNormal = () => {
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
    const [strategy_amount_early, setStrategy_amount_early] = useState([]);



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
            strategy_description: '',
            starategylogo: ''
        },
        validate: (values) => {
            const errors = {};
            if (!values.strategyname) {
                errors.strategyname = valid_err.EMPTY_STRATEGY_NAME_ERR;
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
        { name: 'strategyname', label: 'Strategy Name', type: 'text', label_size: 12, col_size: 6, disable: false },
        // { name: 'perlot', label: 'Per Lot Amount', type: 'text', label_size: 12, col_size: 6, disable: false },
        // { name: 'Catagory', label: 'catagory', type: 'text', label_size: 12, col_size: 6, disable: false },
        {
            name: 'segment',
            label: 'Select Segment',
            type: 'select',
            options: CatagoryData.data && CatagoryData.data.map((item) => ({ label: item.name, value: item.segment })),
            label_size: 12, col_size: 6, disable: false
        },
        // { name: 'indecator', label: 'Indicator ', type: 'file', label_size: 12, col_size: 6, disable: false },
        // { name: 'strategytester', label: 'Strategy Tester ', type: 'file', label_size: 12, col_size: 6, disable: false },
        // { name: 'starategylogo', label: 'Strategy Logo ', type: 'file', label_size: 6, col_size: 6, disable: false },
        { name: 'strategy_description', label: 'Strategy Description', type: 'msgbox', row_size: 7, label_size: 6, col_size: 6, disable: false },

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



    const SelectPlanValues = (name, value) => {
        setSelectPlanArr((prev) => {
            // Check if an entry with the same "type" already exists
            const index = prev.findIndex((obj) => obj.type === name);

            if (index !== -1) {
                // Update the existing entry
                prev[index] = { type: name, price: value };
            } else {
                // If the "type" is unique, add a new entry
                prev.push({ type: name, price: value });
            }

            return [...prev];
        });
    }

 

    return (
        <>
            <Content Page_title="Add Strategy " button_title="Back" route="/admin/strategies">
                <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Strategy" title='addstrategy'

                //   additional_field={
                //         <>
                //             <div className='row'>
                //                 <div className="col-12">
                //                     {/* <h6>Select Plans</h6> */}
                //                     <div class="form-check">
                //                         <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={() => setSelectPlan(!SelectPlan)} />
                //                         <label class="form-check-label" for="flexCheckDefault">
                //                             Select Plans
                //                         </label>
                //                     </div>
                //                 </div>
                //                 {SelectPlan ? <>
                //                     <div className={`col-lg-3`}>
                //                         <div className="mb-3 row flex-column">
                //                             <label
                //                                 className={`col-lg-4`}
                //                                 htmlFor="Monthly"
                //                             >
                //                                 Monthly
                //                                 <span className="text-danger">*</span>
                //                             </label>
                //                             <div
                //                             >
                //                                 <input
                //                                     type="text"
                //                                     className="form-control"
                //                                     id='Monthly'
                //                                     placeholder={`Enter A Monthly Plan Amount`}
                //                                     onChange={(e) => { SelectPlanValues("monthly", e.target.value); setStrategy_amount_month(e.target.value) }}
                //                                     value={strategy_amount_month}

                //                                 />
                //                                 <div className="invalid-feedback">
                //                                     Enter A Monthly Plan Amount
                //                                 </div>
                //                             </div>
                //                         </div>
                //                     </div>
                //                     <div className={`col-lg-3`}>
                //                         <div className="mb-3 row flex-column">
                //                             <label
                //                                 className={`col-lg-4`}
                //                                 htmlFor="Quaterly"
                //                             >
                //                                 Quaterly
                //                                 <span className="text-danger">*</span>
                //                             </label>
                //                             <div
                //                             >
                //                                 <input
                //                                     type="text"
                //                                     className="form-control"
                //                                     id='Quaterly'
                //                                     placeholder={`Enter A Quaterly Plan Amount`}
                //                                     onChange={(e) => { SelectPlanValues("quaterly", e.target.value); setStrategy_amount_quarterly(e.target.value) }}
                //                                     value={strategy_amount_quarterly}


                //                                 />
                //                                 <div className="invalid-feedback">
                //                                     Enter A Quaterly Plan Amount
                //                                 </div>

                //                             </div>
                //                         </div>
                //                     </div>
                //                     <div className={`col-lg-3`}>
                //                         <div className="mb-3 row flex-column">
                //                             <label
                //                                 className={`col-lg-4`}
                //                                 htmlFor="monthly"
                //                             >
                //                                 monthly
                //                                 <span className="text-danger">*</span>
                //                             </label>
                //                             <div
                //                             >
                //                                 <input
                //                                     type="text"
                //                                     className="form-control"
                //                                     id='Half-Yearly'
                //                                     placeholder={`Enter a Half-Yearly Plan Value`}
                //                                     onChange={(e) => { SelectPlanValues("halfyearly", e.target.value); setStrategy_amount_half_early(e.target.value) }}
                //                                     value={strategy_amount_half_early}


                //                                 />
                //                                 <div className="invalid-feedback">
                //                                     Enter A Half-Yearly Plan Amount
                //                                 </div>

                //                             </div>
                //                         </div>
                //                     </div>
                //                     <div className={`col-lg-3`}>
                //                         <div className="mb-3 row flex-column">
                //                             <label
                //                                 className={`col-lg-4`}
                //                                 htmlFor="Yearly"
                //                             >
                //                                 Yearly
                //                                 <span className="text-danger">*</span>
                //                             </label>
                //                             <div
                //                             >
                //                                 <input
                //                                     type="text"
                //                                     className="form-control"
                //                                     id='Yearly'
                //                                     placeholder={`Enter a Yearly Plan Value`}
                //                                     onChange={(e) => { SelectPlanValues("yearly", e.target.value); setStrategy_amount_early(e.target.value) }}
                //                                     value={strategy_amount_early}

                //                                 />
                //                                 <div className="invalid-feedback">
                //                                     Please enter a Yearly Plan Value
                //                                 </div>
                //                             </div>
                //                         </div>
                //                     </div>
                //                 </> : ""}
                //             </div>
                //         </>
                //     }
                />
                < ToastButton />
            </Content >

        </>
    )
}


export default AddStraegyNormal

