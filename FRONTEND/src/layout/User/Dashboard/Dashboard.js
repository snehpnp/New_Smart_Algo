import React, { useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import BasicTable from '../../../Components/ExtraComponents/Tables/BasicTable'
import { Pencil, Trash2 } from 'lucide-react';
import { No_Negetive_Input_regex } from "../../../Utils/Common_regex"
import { GetAliceTokenAndID, CreateSocketSession, ConnctSocket } from "../../../Service/Alice_Socket"


const BrokerResponse = () => {
    const [enterqty, setEnterQty] = useState("")



    const RunSocket = async () => {

        // let aa = No_Negetive_Input_regex(enterqty)

        // if (aa) {
        //     console.log("negetive")
        // }



        let type = { loginType: "API" }
        let channelList = "NSE|11956"

        const res = await CreateSocketSession(type)
        if (res.data.stat) {
            const handleResponse = (response) => {
                // console.log("response", response);

            };

            await ConnctSocket(handleResponse, channelList);

        }

    }




    return (
        <Content Page_title="Dashboard" button_status={false}>
            <button onClick={() => RunSocket()}>run socket</button>
            <table className="table table-responsive-sm ">
                <thead className='bg-primary'>
                    <tr>
                        <th>#</th>
                        <th>Live Price</th>
                        <th>Symboll</th>
                        <th>Qty</th>
                        <th>Strategy</th>
                        <th>Order Type</th>
                        <th>Profuct Type</th>
                        <th>Trading </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>1</th>
                        <td>242.06</td>
                        <td>
                            ADANITRANS#
                        </td>
                        <td>
                            <div className="row d-flex">
                                <div className="col-lg-12 ">
                                    <input type='text' name='qty' className="form-control" id='qty'
                                        placeholder='Enter Qty'
                                        onChange={(e) => setEnterQty(e.target.value)}
                                        value={enterqty}
                                    />
                                    {/* {formik.errors[field.name] && */}
                                    {/* <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>} */}
                                </div>
                            </div></td>
                        <td className="color-primary">
                            <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </td>
                        <td className="color-primary">
                            <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </td>
                        <td className="color-primary">
                            <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </td>
                        <td className="color-primary">
                            <label class="toggle">
                                <input class="toggle-checkbox bg-primary" type="checkbox"
                                // onChange={(e) => {
                                //   setShowAllStratagy(e.target.checked)
                                // }}
                                />
                                {/* //  ${ShowAllStratagy ? 'bg-primary' : "bg-secondary" } */}
                                <div class={`toggle-switch

                 `}></div>
                            </label>

                        </td>
                    </tr>

                </tbody>
            </table>
        </Content>
    )
}


export default BrokerResponse
