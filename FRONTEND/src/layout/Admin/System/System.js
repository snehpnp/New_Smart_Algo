/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content";
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { GET_COMPANY_INFOS } from '../../../ReduxStore/Slice/Admin/AdminSlice';
import { Pencil } from 'lucide-react';
import ToastButton from '../../../Components/ExtraComponents/Alert_Toast'
import toast from 'react-hot-toast'
import $ from "jquery"
import { DisclaimerMessage } from '../../../ReduxStore/Slice/Admin/SystemSlice';
import { Button, Row, Col, Form } from 'react-bootstrap';
import UpdateCompanyInfo from './UpdateCompanyInfo';
import UpdateImages from './UpdateImages';
import UpdateSmptDetails from './UpdateSmptDetails';
import { useDispatch } from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const System = () => {
    const dispatch = useDispatch();
    const [diss, setDiss] = useState('');
    const [inputs, setInputs] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [getDissStatus, setDissStatus] = useState('');
    const [showImgModal, setshowImgModal] = useState(false);
    const [ShowEmailModal, setShowEmailModal] = useState(false);
    const [getCompanyName, setCompanyName] = useState({ loading: true, data: [] });
    const [PanelDetailsModal, setPanelDetailsModal] = useState(false);



    const CompanyName = async () => {
        await dispatch(GET_COMPANY_INFOS()).unwrap()
            .then((response) => {
                if (response.status) {
                    setDiss(response.data[0].disclaimer);
                    setDissStatus(response.data[0].disclaimer_status);
                    setInputs(response.data[0].dissArr);

                    setCompanyName({
                        loading: false,
                        data: response.data
                    });
                    $(".set_Favicon");

                    let favicon = $("link[rel='icon']").length
                        ? $("link[rel='icon']")
                        : $("<link rel='icon' type='image/x-icon' />");
                    favicon.attr('href', response.data && response.data[0].favicon);
                    $('head').append(favicon);
                }
            });
    }

    const Company_columns = [
        {
            dataField: 'index',
            text: 'Company ID',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'panel_name',
            text: 'Company Name'
        },
        {
            dataField: 'panel_short_name',
            text: 'Company Short Name'
        },
        {
            dataField: 'prefix',
            text: 'Version'
        },
        {
            dataField: 'Action',
            text: 'Action',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" onClick={() => setPanelDetailsModal(true)} />
                    </span>
                </div>
            ),
        },
    ];

    const Email_columns = [
        {
            dataField: 'id',
            text: 'Email ID',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'email',
            text: 'Email'
        },
        {
            dataField: 'cc_mail',
            text: 'CC'
        },
        {
            dataField: 'bcc_mail',
            text: 'BCC'
        },
        {
            dataField: 'smtp_password',
            text: 'Password'
        },
        {
            dataField: 'smtphost',
            text: 'SMTP Host'
        },
        {
            dataField: 'smtpport',
            text: 'SMTP Port'
        },
        {
            dataField: 'Action',
            text: 'Action',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" onClick={() => setShowEmailModal(true)} />
                    </span>
                </div>
            ),
        },
    ];

    const background_images = [
        {
            dataField: 'id',
            text: 'ID',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'favicon',
            text: 'Favicon',
            formatter: (cell, row, rowIndex) => (
                <img src={cell} alt="Favicon" className="logo-abbr w-25" width="100" height='100' />
            ),
        },
        {
            dataField: 'logo',
            text: 'Logo',
            formatter: (cell, row, rowIndex) => (
                <img src={cell} alt="Logo" className='logo-abbr w-25' width="100" height='100' />
            ),
        },
        {
            dataField: 'loginimage',
            text: 'Login Image',
            formatter: (cell, row, rowIndex) => (
                <img src={cell} alt="Login Image" className='logo-abbr w-25' width="100" height='100' />
            ),
        },
        {
            dataField: 'watermark',
            text: 'Water Mark',
            formatter: (cell, row, rowIndex) => (
                <img src={cell} alt="Water Mark" className='logo-abbr ' width="100" height='100' />
            ),
        },
        {
            dataField: 'Action',
            text: 'Action',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" onClick={() => setshowImgModal(true)} />
                    </span>
                </div>
            ),
        },
    ];

    const handleSubmit = async () => {
        const data1 = inputs.map((input, index) => ({ id: index + 1, value: input.value }));
        const data = { id: "6501756b2a8e6d952493b7f4", disclaimer: diss, dataArr: data1 };

        await dispatch(DisclaimerMessage(data)).unwrap()
            .then((response) => {
                if (response.status) {
                    toast.success("Disclaimer added successfully...");
                    setRefresh(!refresh);
                } else {
                    toast.error("Disclaimer add error");
                }
            })
            .catch((err) => {
                return;
            });
    }

    const handleAddInput = () => {
        setInputs([...inputs, { value: '' }]);
    };

    const handleRemoveInput = () => {
        if (inputs.length > 1) {
            setInputs(inputs.slice(0, -1));
        }
    };

    const handleInputChange = (index, event) => {
        const newInputs = inputs.map((input, i) =>
            i === index ? { ...input, value: event.target.value } : input
        );
        setInputs(newInputs);
    };

    const updateDiscStatus = async (e) => {

        const data = { id: "6501756b2a8e6d952493b7f4", disclaimer_status: e.target.checked ? "1" : "0" };

        await dispatch(DisclaimerMessage(data)).unwrap()
            .then((response) => {
                if (response.status) {
                    toast.success("Disclaimer added successfully...");
                    window.location.reload();
                } else {
                    toast.error("Disclaimer add error");
                }
            })
            .catch((err) => {

            });
    }

    useEffect(() => {
        CompanyName();
    }, []);

    const setPageStatus = (k) => {
        localStorage.setItem("pageStatus", k);
    }


    var PageStatus = localStorage.getItem("pageStatus") || 1

    return (
        <Content Page_title="System" button_status={false}>


            <Tabs
                defaultActiveKey={PageStatus}
                id="fill-tab-example"
                className="mb-3"
                fill
                onSelect={(k) => setPageStatus(k)}
            >
                <Tab eventKey="1" title="Company Information" >
                    <h2>Company Information</h2>
                    <BasicDataTable tableData={getCompanyName.data} TableColumns={Company_columns} dropdown={false} />

                </Tab>
                <Tab eventKey="2" title="Email Information">

                    <h2>Email Information</h2>
                    <BasicDataTable tableData={getCompanyName.data} TableColumns={Email_columns} dropdown={false} />

                </Tab>
                <Tab eventKey="3" title="Background Images">
                    <h2>Background Images</h2>
                    <BasicDataTable tableData={getCompanyName.data} TableColumns={background_images} dropdown={false} />
                </Tab>

                <Tab eventKey="4" title="Disclaimer Message" >

                    <div className='Disclamer'>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h2 style={{ marginRight: "10px" }}>Disclaimer Message</h2>

                            <div className='toogle-new'>
                                <input type="checkbox"
                                    id="switch"
                                    checked={Number(getDissStatus) === 1}
                                    onChange={(e) => updateDiscStatus(e)}
                                />
                                <label htmlFor="switch">Toggle</label>
                            </div>
                        </div>

                        <textarea
                            className='col-lg-12 mb-3 p-2'
                            rows="5"
                            placeholder='Enter your disclaimer message'
                            onChange={(e) => setDiss(e.target.value)}
                            value={diss}
                        />

                        {inputs.map((input, index) => (
                            <Row key={index} className="mb-3">
                                <Col>
                                    <Form.Control
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(index, e)}
                                        placeholder='Enter your disclaimer message'
                                    />
                                </Col>
                            </Row>
                        ))}
                        <Button variant="primary" onClick={handleAddInput}>
                            +
                        </Button>{' '}
                        <Button variant="danger" onClick={handleRemoveInput}>
                            -
                        </Button>

                        <button type='submit' className='btn btn-primary mx-2' onClick={handleSubmit}>Submit</button>

                    </div>
                </Tab>

            </Tabs>




            <UpdateCompanyInfo data={getCompanyName && getCompanyName.data} showModal={PanelDetailsModal} setshowModal={() => setPanelDetailsModal(false)} />
            <UpdateSmptDetails data={getCompanyName && getCompanyName.data} showModal={ShowEmailModal} setshowModal={() => setShowEmailModal(false)} />
            <UpdateImages data={getCompanyName && getCompanyName.data} showModal={showImgModal} setshowModal={() => setshowImgModal(false)} />

            <ToastButton />
        </Content>
    );
}

export default System;