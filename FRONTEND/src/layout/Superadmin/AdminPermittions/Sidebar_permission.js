import React, { useState, useEffect } from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';
import { useFormik } from 'formik';
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form1"
import { useDispatch } from "react-redux";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { Update_Admin_Permissions } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import toast from 'react-hot-toast';
import * as Config from "../../../Utils/Config";


const Sidebar_permission = ({ showModal, setshowModal, showPanelName }) => {
    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem('user_details')).token

    const [GetCreate_Strategy, setGetCreate_Strategy] = useState("")
    const [GetOption_chain, setGetOption_chain] = useState("")
    const [getStrategy_plan, setGetStrategy_plan] = useState("")

    // console.log("GetCreate_Strategy", GetCreate_Strategy)
    // console.log("GetOption_chain", GetOption_chain)
    // console.log("getStrategy_plan", getStrategy_plan)




    const formik = useFormik({
        initialValues: {
            optionchain: false,
            createstrategy: false,
            tradhistory: false,
            Strategy_plan: false,
        },
        validate: (values) => {

            const errors = {};
            if (!values.username) {
                // errors.username = valid_err.USERNAME_ERROR;
            }

            return errors;
        },
        onSubmit: async (values) => {
     
            console.log("GetOption_chain -",GetOption_chain && GetOption_chain)
            console.log("GetCreate_Strategy -",GetCreate_Strategy && GetCreate_Strategy)
            // console.log("showPanelName -",showPanelName)
           
            const req = {
                "Option_chain": GetOption_chain && GetOption_chain ? 1 : 0,
                "Create_Strategy": GetCreate_Strategy && GetCreate_Strategy ? 1 : 0,
                "Trade_History": 1 ? 1 : 0,
                "Strategy_plan": getStrategy_plan && getStrategy_plan ? 1 : 0,
                "db_url": showPanelName.db_url,
                "db_name": showPanelName.db_name,
                "key": showPanelName.key,
                "domain": showPanelName.rowdata.domain,

            }

            console.log("req -", req)
            return
             
            await dispatch(Update_Admin_Permissions({ req: req, token: token })).unwrap().then((response) => {
                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                    toast.success(response.msg);
                    setshowModal(!showModal)
                    window.location.reload()
                }
                else if (!response.status) {
                    toast.error(response.msg);
                }

            })
        }

    });



    useEffect(() => {
        setGetCreate_Strategy(showPanelName.rowdata && showPanelName.rowdata.Create_Strategy)
        setGetStrategy_plan(showPanelName.rowdata && showPanelName.rowdata.Strategy_plan)
        setGetOption_chain(showPanelName.rowdata && showPanelName.rowdata.Option_chain)
    }, [showPanelName.rowdata])



    const fields = [
        // { name: 'optionchain', label: 'Option Chain', type: 'checkbox', label_size: 12, col_size: 6, disable: false },
        // { name: 'createstrategy', label: 'Create Strategy', type: 'checkbox', label_size: 12, col_size: 6, disable: false },
        // { name: 'tradhistory', label: 'TradHistory', type: 'checkbox', label_size: 12, col_size: 6, disable: false },

    ]



    return (
        <div>
            <Modal isOpen={showModal} backdrop="static" size="md" title="
        Sidebar Permission" hideBtn={true}
                handleClose={() => setshowModal(false)}
            >
                <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update"
                    title="Update"

                    additional_field={
                        <>
                            <div className='d-flex row'>
                                {/* {GetAllBrokerName && GetAllBrokerName.map((strategy) => ( */}
                                <div className={`col-lg-6 my-2`}
                                >
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input"
                                            name="createstrategy"
                                            value={GetCreate_Strategy && GetCreate_Strategy}
                                            onChange={(e) => setGetCreate_Strategy(e.target.checked)}
                                            defaultChecked={GetCreate_Strategy && GetCreate_Strategy === 1}
                                        />
                                        <label className="form-check-label"
                                            for='createstrategy'
                                        >
                                            Create Strategy
                                        </label>
                                    </div>
                                </div>
                                <div className={`col-lg-6 my-2`}
                                >
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input"
                                            name="optionchain"
                                            value={GetOption_chain && GetOption_chain}
                                            onChange={(e) => setGetOption_chain(e.target.checked)}
                                            defaultChecked={GetOption_chain && GetOption_chain === 1}

                                        />
                                        <label className="form-check-label"
                                            for='optionchain'
                                        >
                                            Option Chain
                                        </label>
                                    </div>
                                </div>
                                <div className={`col-lg-12 my-2`}
                                >
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input"
                                            name="Strategy_plan"
                                            value={getStrategy_plan && getStrategy_plan}
                                            onChange={(e) => setGetStrategy_plan(e.target.checked)}
                                            defaultChecked={getStrategy_plan && getStrategy_plan === 1}

                                        />
                                        <label className="form-check-label"
                                            for='Strategy_plan'
                                        >
                                            Strategy Plan
                                        </label>
                                    </div>
                                </div>
                                {/* ))} */}

                            </div>
                            <ToastButton />

                        </>}
                />
            </Modal >
            <ToastButton />
        </div>
    )
}

export default Sidebar_permission