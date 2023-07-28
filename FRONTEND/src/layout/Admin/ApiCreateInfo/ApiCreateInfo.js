import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import AlertToast from '../../../Components/ExtraComponents/Alert_Toast'

import toast, { Toaster } from 'react-hot-toast';


const ApiCreateInfo = () => {


    return <>
        <Content Page_title="ApiCreateInfo">
            <AlertToast type={toast.error} />

        </Content>
        )
    </>
}


export default ApiCreateInfo