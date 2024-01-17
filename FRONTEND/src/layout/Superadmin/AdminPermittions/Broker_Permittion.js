import React, { useEffect, useState } from 'react'

import Modal from '../../../Components/ExtraComponents/Modal';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from "react-redux";
import { Add_Licence_To_Company, All_Brokers, Update_Comapny_Brokers } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form"
import * as Config from "../../../Utils/Config";
import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";


const Broker_Permittion = ({ showModal, setshowModal, showPanelName, List }) => {
    const dispatch = useDispatch()

    const [GetAllBrokerName, setGetAllBrokerName] = useState(false)
    const [SelectedBrokers, setSelectedBrokers] = useState([])
    const [refresh, setRefresh] = useState(false)

     

    const formik = useFormik({
        initialValues: {
            broker: null,
        },
        validate: (values) => {

            const errors = {};
            // if (!values.licence) {
            //     errors.licence = valid_err.USERNAME_ERROR;
            // }
            return errors;
        },
        onSubmit: async (values) => {
           
          //  console.log('List',List.domain)
          //  console.log('SelectedBrokers',SelectedBrokers)
           
            const req = {
                "data": SelectedBrokers,
                "domain": List.domain,

            }

            await dispatch(Update_Comapny_Brokers(req)).unwrap().then((response) => {
                console.log("response", response)
                if (response.status) {
                    toast.success(response.msg);
                    setshowModal(false)
                    setRefresh(!refresh)
                    window.location.reload()
                }
                else {
                    toast.success(response.msg);
                }


            })
        }
    });


    const data1 = async () => {
        if (showModal) {
            await dispatch(All_Brokers()).unwrap()
                .then((response) => {
                    console.log("setPanelData", response)
                    setGetAllBrokerName(
                        response.data
                    );
              })
         }
    }

    //  
    useEffect(() => {
        data1()
    }, [showModal, refresh])

    useEffect(() => {
        let abc = []
        // console.log("List && List" ,List && List)
        List && List.broker_id.map((item) => {
            abc.push({
                id: item.id,
                name: item.name
            })
        })
        setSelectedBrokers(abc)
    }, [showModal, refresh])


    const DefaultSelectesCheckBox = (strategy) => {
        let abc = List && List.broker_id.some((selectedBroker) => selectedBroker.id === strategy)
        return abc
    }


  



    const fields = [
        // {
        //     name: 'optionchain',
        //     label: 'Option Chain',
        //     type: 'checkbox',
        //     options: GetAllBrokerName && GetAllBrokerName.map((item) => ({ label: item.title, value: item.broker_id })),
        //     label_size: 12, col_size: 4, disable: false, isSelected: true
        // },
    ]

    const handleStrategyChange = (event, strategy_id) => {
       // console.log("strategy_id", strategy_id)
        const strategyId = event.target.value;
        const strategyName = event.target.name;
        if (event.target.checked) {
            setSelectedBrokers([...SelectedBrokers, { id: strategyName, name: strategyId }]);
        } else {
            setSelectedBrokers(SelectedBrokers.filter((strategy) => strategy.id !== strategy_id));
        }
    };



    return (
        <div>   <Modal isOpen={showModal} size="lg" title="Broker Permission" hideBtn={true}
            handleClose={() => setshowModal(false)}
        >
            <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update "
                fromDate={formik.values.fromDate}
                toDate={formik.values.todate}
                additional_field={
                    <>
                        <div className='d-flex row'>
                            {GetAllBrokerName && GetAllBrokerName.map((strategy) => (
                                <div className={`col-lg-3 my-2`} key={strategy._id}>
                                    <div className="col-lg-12 ">
                                        <input type='checkbox' className="form-check-input" name={strategy.broker_id}
                                            value={strategy.title}
                                            onChange={(e) => handleStrategyChange(e, strategy.broker_id)}
                                            defaultChecked={DefaultSelectesCheckBox(strategy.broker_id)}
                                        />
                                        <label className="form-check-label" for={strategy._id}>{strategy.title}</label>
                                    </div>
                                </div>
                            ))}

                        </div>
                        <ToastButton />

                    </>} />

        </Modal>

        </div>
    )
}

export default Broker_Permittion