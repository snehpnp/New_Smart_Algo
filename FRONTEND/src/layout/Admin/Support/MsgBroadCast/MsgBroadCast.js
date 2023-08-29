import React from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';

const MsgBroadCast = () => {

    const fields = [
        { name: 'strategy', label: 'Strategy', type: 'text' },
    ]
    const formik = useFormik({
        initialValues: {
            strategy: '',
        },
    })
    return <>
        <Content Page_title="Message Broadcast">
        <Formikform 
        fieldtype={fields.filter(field => !field.showWhen)} 
        formik={formik} 
        btn_name="Send" 
        style={{ width:100}}/>
        </Content>
    </>
}


export default MsgBroadCast


