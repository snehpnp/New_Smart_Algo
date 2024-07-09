import Content from "../../../../Components/Dashboard/Content/Content"
import React, { useEffect, useState } from 'react'
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import { useDispatch } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const Edit7days = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [Addsubadmin, setAddsubadmin] = useState({
        loading: false,
        data: []
    });



    const fields = [
        { name: 'username', label: 'Username', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'mobile', label: 'Mobile', type: 'text' },
        { name: 'password', label: 'Password', type: 'password' },
    ]

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            mobile: '',
            password: '',
        },
       
        onSubmit: async (values) => {

    
        }
    });


    return (
        <>
            {
                Addsubadmin.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Edit 7-days Entry" button_title="Back" route="/admin/signupclients"> 

                            <Formikform fieldtype={fields.filter(field => !field.showWhen)} formik={formik} btn_name="Edit Entry" />
                        </Theme_Content>
                    </>
            }



        </ >
    )
    {/* <>
        <Content Page_title="AllSubadmin">
            <p>AllSubadmin 123</p>
        </Content>
        )
    </> */}
}


export default Edit7days;
