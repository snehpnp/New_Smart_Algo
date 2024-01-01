/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_All_Theme, getthemedata } from '../../../ReduxStore/Slice/ThemeSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';
import { Upload } from 'lucide-react';

const CompanyTheme = () => {

    const dispatch = useDispatch()

    const theme_list = useSelector(getthemedata && getthemedata)

    const [showModal, setshowModal] = useState(false)

    const [themeData, setThemeData] = useState({
        loading: true,
        data: []
    });


    useEffect(() => {
        dispatch(Get_All_Theme())
    }, [dispatch])



    useEffect(() => {
        if (theme_list !== undefined) {
            if (theme_list && theme_list.gettheme) {
                setThemeData({
                    loading: false,
                    data: theme_list.gettheme
                });
            }
            if (theme_list !== undefined && theme_list.gettheme.message === "Network Error") {
                alert(theme_list.gettheme.message);
            }
        }
    }, [theme_list]);




    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'theme_name',
            text: 'Theme Name'
        },
        {
            dataField: 'price',
            text: 'Product Name'
        },
        {
            dataField: 'price',
            text: 'Uplaod Theme Img',
            formatter: (cell, row, rowIndex) => <>
                <Upload onClick={() => setshowModal(true)} />
            </>,

        },
        // {
        //     dataField: 'price',
        //     text: 'Product Name'
        // },
        // {
        //     dataField: 'price',
        //     text: 'Product Name'
        // },
    ];


    const [file, setFile] = useState();
    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }


    return (
        <Content Page_title="Company Theme" button_status={false}>
            <button onClick={() => setshowModal(true)} className='btn btn-primary mb-3'> Upload Theme Img</button>
            {
                themeData.loading ? (
                    <Loader />
                ) : themeData.data && themeData.data.length === 0 ? (
                    'No data found'
                ) : (
                    <FullDataTable TableColumns={columns} tableData={themeData.data.data} />
                )
            }

            <Modal isOpen={showModal} size="md" title="Upload Theme Image" hideBtn={true}
                handleClose={() => setshowModal(false)}
            >


                {/* <div className={`col-lg-12`}>
                    <div className="row d-flex">
                        <div className="mb-3">
                            <label className={`col-form-12`} htmlFor="uploadtheme">
                                uploadtheme
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="file"
                                id="uploadtheme"
                                onChange={(e) => handleChange(e)}
                                className={`form-control`}
                            />
                        </div>
                        <img src={file} name='uploadtheme' alt={`Upload Theme Img`} className={`col-lg-12 ms-3
                                   mb-3 border border-2`}
                            style={{ height: '150px', width: "95%" }}
                        />
                    </div>
                </div> */}
            </Modal>
        </Content >
    );
}


export default CompanyTheme
