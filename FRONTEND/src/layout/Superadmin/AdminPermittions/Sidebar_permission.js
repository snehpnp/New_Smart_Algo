import React, { useState, useEffect } from 'react';
import Modal from '../../../Components/ExtraComponents/Modal';
import { useFormik } from 'formik';
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form1";
import { useDispatch } from "react-redux";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { Update_Admin_Permissions } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice';
import toast from 'react-hot-toast';
import * as Config from "../../../Utils/Config";

const Sidebar_permission = ({ showModal, setshowModal, showPanelName }) => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem('user_details')).token;

    const [GetCreate_Strategy, setGetCreate_Strategy] = useState(false);
    const [GetOption_chain, setGetOption_chain] = useState(false);
    const [getStrategy_plan, setGetStrategy_plan] = useState(false);
    const [live_price, setLive_price] = useState(false);
    const [Two_day_client, setTwo_day_client] = useState(false);
    const [getReferAndEarn, setReferAndEarn] = useState(false);
    const [planPermission, setPlanPermission] = useState(false);


    const formik = useFormik({
        initialValues: {
            optionchain: false,
            createstrategy: false,
            tradhistory: false,
            Strategy_plan: false,
            live_price: false,
            Two_day_client: false,
            Refer_Earn: false,
            Plans: false,
        },
        validate: (values) => {
            const errors = {};
            if (!values.username) {
                // errors.username = valid_err.USERNAME_ERROR;
            }
            return errors;
        },
        onSubmit: async (values) => {
            const req = {
                "Option_chain": GetOption_chain ? 1 : 0,
                "Create_Strategy": GetCreate_Strategy ? 1 : 0,
                "Trade_History": 1,
                "Strategy_plan": getStrategy_plan ? 1 : 0,
                "live_price": live_price ? 1 : 0,
                "Two_day_client": Two_day_client ? 1 : 0,
                "db_url": showPanelName.db_url,
                "db_name": showPanelName.db_name,
                "key": showPanelName.key,
                "domain": showPanelName.rowdata.domain,
                "Refer_Earn": getReferAndEarn ? 1 : 0,
                "Plans": planPermission ? 1 : 0

            };

            await dispatch(Update_Admin_Permissions({ req: req, token: token })).unwrap().then((response) => {
                
                if (response.status === 409) {
                    toast.error(response.data.msg);
                } else if (response.status) {
                    toast.success(response.msg);
                    clearData();
                    setshowModal(false);
                    window.location.reload();
                } else {
                    toast.error(response.msg);
                }
            });
        }
    });

    useEffect(() => {
        if (showModal) {
            loadInitialData();
        }
    }, [showModal, showPanelName.rowdata]);

    const loadInitialData = () => {
        setGetCreate_Strategy(!!showPanelName.rowdata?.Create_Strategy);
        setGetStrategy_plan(!!showPanelName.rowdata?.Strategy_plan);
        setGetOption_chain(!!showPanelName.rowdata?.Option_chain);
        setLive_price(!!showPanelName.rowdata?.live_price);
        setTwo_day_client(!!showPanelName.rowdata?.Two_day_client);
        setReferAndEarn(!!showPanelName.rowdata?.Refer_Earn);
        setPlanPermission(!!showPanelName.rowdata?.Plans);


    };

    const clearData = () => {
        setGetCreate_Strategy(false);
        setGetOption_chain(false);
        setGetStrategy_plan(false);
        setLive_price(false);
        setTwo_day_client(false);
        setReferAndEarn(false);
        setPlanPermission(false);

    };

    const fields = [];


    return (
        <div>
            <Modal isOpen={showModal} backdrop="static" size="md" title="Sidebar Permission" hideBtn={true}
                handleClose={() => { setshowModal(false); clearData(); }}
            >
                <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update"
                    title="Update"
                    additional_field={
                        <>
                            <div className='d-flex row'>
                                <div className={`col-lg-6 my-2`}>
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input"
                                            name="createstrategy"
                                            checked={GetCreate_Strategy}
                                            onChange={(e) => setGetCreate_Strategy(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor='createstrategy'>
                                            Create Strategy
                                        </label>
                                    </div>
                                </div>
                                <div className={`col-lg-6 my-2`}>
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input"
                                            name="optionchain"
                                            checked={GetOption_chain}
                                            onChange={(e) => setGetOption_chain(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor='optionchain'>
                                            Option Chain
                                        </label>
                                    </div>
                                </div>
                                <div className={`col-lg-6 my-2`}>
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input"
                                            name="Strategy_plan"
                                            checked={getStrategy_plan}
                                            onChange={(e) => setGetStrategy_plan(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor='Strategy_plan'>
                                            Strategy Plan
                                        </label>
                                    </div>
                                </div>
                                <div className={`col-lg-6 my-2`}>
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input"
                                            name="live_price"
                                            checked={live_price}
                                            onChange={(e) => setLive_price(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor='live_price'>
                                            Live Price
                                        </label>
                                    </div>
                                </div>
                                <div className={`col-lg-6 my-2`}>
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input"
                                            name="Two_day_client"
                                            checked={Two_day_client}
                                            onChange={(e) => setTwo_day_client(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor='Two_day_client'>
                                            Two Day Client
                                        </label>
                                    </div>
                                </div>

                                <div className={`col-lg-6 my-2`}>
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input"
                                            name="Two_day_client"
                                            checked={getReferAndEarn}
                                            onChange={(e) => setReferAndEarn(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor='Two_day_client'>
                                            Refer & Earn
                                        </label>
                                    </div>
                                </div>

                                <div className={`col-lg-6 my-2`}>
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input"
                                            name="Plans"
                                            checked={planPermission}
                                            onChange={(e) => setPlanPermission(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor='Plans'>
                                           Plans
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <ToastButton />
                        </>}
                />
            </Modal>
            <ToastButton />
        </div>
    );
};

export default Sidebar_permission;
