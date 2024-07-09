/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Content from "../../../Components/Dashboard/Content/Content";
import Loader from '../../../Utils/Loader';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import { Get_All_Theme, getthemedata } from '../../../ReduxStore/Slice/ThemeSlice';
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';
import { Upload, Eye } from 'lucide-react';
import * as Config from "../../../Utils/Config";
import axios from "axios";

const CompanyTheme = () => {

    const dispatch = useDispatch();
    const theme_list = useSelector(getthemedata && getthemedata);
    const [showModal, setshowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [themeData, setThemeData] = useState({ loading: true, data: [] });
    const [selectedRow, setSelectedRow] = useState(null);
    const [file, setFile] = useState();
    const [fileBase64, setFileBase64] = useState('');
    const [fullImage, setFullImage] = useState(null);
    const [getThemeId, setThemeId] = useState(null);

    useEffect(() => {
  
        dispatch(Get_All_Theme());
    }, [dispatch]);

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
            text: 'Upload Theme Img',
            formatter: (cell, row, rowIndex) => (
                <Upload onClick={() => handleUploadClick(row)} />
            ),
        },
        {
            dataField: 'image',
            text: 'Uploaded Image',
            formatter: (cell, row, rowIndex) => (
                <div className="image-container">
                    <img style={{ height: "100px" }} src={cell} alt="Theme Thumbnail" onClick={() => handleImageClick(cell)} />
                    <div className="overlay">
                        <Eye className="eye-icon" onClick={() => handleImageClick(cell)} />
                    </div>
                </div>
            ),
        },
    ];

    const handleUploadClick = (row) => {
        setThemeId(row._id);
        setSelectedRow(row);
        setshowModal(true);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result);
                setFileBase64(reader.result.split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateClick = () => {
        if (selectedRow && fileBase64) {
            let data = JSON.stringify({
                "theme_id": getThemeId,
                "image": file
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: Config.base_url + 'find_one_update/theme_img',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                 
                    window.location.reload();
                })
                .catch((error) => {
                  
                });

            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setshowModal(false);
        setFile(null);
        setFileBase64('');
        setSelectedRow(null);
    };

    const handleImageClick = (imageUrl) => {
        setFullImage(imageUrl);
        setShowImageModal(true);
    };

    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setFullImage(null);
    };


    return (
        <Content Page_title="Company Theme" button_status={false}>
            {
                themeData.loading ? (
                    <Loader />
                ) : themeData.data && themeData.data.length === 0 ? (
                    'No data found'
                ) : (
                    <FullDataTable TableColumns={columns} tableData={themeData.data.data} pagination1={true} />
                )
            }

            <Modal isOpen={showModal} size="md" title="Upload Theme Image" hideBtn={true}
                handleClose={handleCloseModal}
            >
                <div className={`col-lg-12`}>
                    <div className="row d-flex">
                        <div className="mb-3">
                            <label className={`col-form-12`} htmlFor="uploadtheme">
                                Upload Theme
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="file"
                                id="uploadtheme"
                                onChange={handleChange}
                                className={`form-control`}
                            />
                        </div>
                        {file && (
                            <img src={file} name='uploadtheme' alt={`Upload Theme Img`} className={`col-lg-12 ms-3 mb-3 border border-2`}
                                style={{ height: '150px', width: "95%" }}
                            />
                        )}
                    </div>
                    <button className="btn btn-primary" onClick={handleUpdateClick}>Update</button>
                </div>
            </Modal>

            <Modal isOpen={showImageModal} size="lg" title="Full Size Image" hideBtn={true}
                handleClose={handleCloseImageModal}
            >
                <div className={`col-lg-12`}>
                    <img src={fullImage} alt="Full Size Theme Img" className={`col-lg-12`} style={{ width: '100%' }} />
                </div>
            </Modal>
        </Content>
    );
}

export default CompanyTheme;
