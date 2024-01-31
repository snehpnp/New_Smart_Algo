/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import { useDispatch } from "react-redux";
import { All_Api_Info_List } from '../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice';
import Modal from '../../../Components/ExtraComponents/Modal';
import { Eye, CandlestickChart, Pencil } from 'lucide-react';
import { Link } from "react-router-dom";
import * as Config from "../../../Utils/Config";


const ApiCreateInfo = () => {
    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem("user_details"));


    const [showModal, setshowModal] = useState(false)
    const [modalData, setModalData] = useState([])



    const [UserDetails, setUserDetails] = useState({
        loading: true,
        data: [],
    });


    const goToDashboard = JSON.parse(localStorage.getItem("user_details_goTo"));
    
 


    const data = async () => {

        await dispatch(All_Api_Info_List({ token: token, url: Config.react_domain  , brokerId: -1})).unwrap()
            .then((response) => {
                if (response.status) {
                    setUserDetails({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        data()
    }, [])


    const ShowData = (item) => {
        setshowModal(true)
        setModalData(item)
    }


     
    return <>
        <Content Page_title="All Api-Create Info's" button_status={false}>
            <div class="row">
                <section class="card__container">

                    {/* {goToDashboard ? } */}
                    {UserDetails.data && UserDetails.data.map((item) => {
                        // {UserDetails.data && UserDetails.data.map((item) => {
                        
                              
                        return <>
                            <div class="card__bx card__1">
                                <div class="card__data">
                                    <div class="card__icon">
                                        <div class="card__icon-bx">
                                            <CandlestickChart />
                                        </div>
                                    </div>

                                    <div class="card__content">
                                        <h3>{item.title}</h3>
                                        <Link style={{
                                            marginRight: '20px',
                                            marginBottom: '20px',
                                            marginTop: '20px',
                                        }} onClick={() => ShowData(item)} >
                                            <Eye className='mx-2' />
                                        </Link>
                                        {/* <Link to="/admin/apicreateinfo/edit" state={item}>
                                            <Pencil className='mx-2' onClick={() => ShowData(item)} />
                                        </Link> */}
                                    </div>
                                </div>
                            </div>
                        </>

                    })}
                </section>
            </div>

            <Modal isOpen={showModal} size="lg" title={`${modalData.title}  API Create Information.`} hideBtn={true}
                handleClose={() => setshowModal(false)}
            >
                {modalData.title === "Alice Blue" ?
                    <h4 className='text-danger mb-1 text-center fw-bold'>ONLY FOR ADMIN</h4>
                    : ""}

                <h4>API Process of {modalData.title}: -</h4>
                {modalData.description ?
                    <ul>
                        {modalData.description && modalData.description.split("\n").map((line, index) => (
                            <>
                                <li key={index}>{line}</li><br />
                            </>
                        ))}
                    </ul>
                    : ""
                }

                {modalData.steptwourl || modalData.imageone ? <>
                    <h4 className="text-decoration-underline">Step 1:  Click below link and Login</h4>
                    <a href={modalData.steponeurl} target="_blank" className="my-3" >{modalData.steponeurl} </a><br />
                    {/* <a
                        href={
                            "https://ant.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB"
                        }
                        target="_blank"
                        className="my-3"
                    >
                        https://ant.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB
                    </a> */}
                    <br />
                    {modalData.imageone ? <img src={modalData.imageone} alt="" class="w-100 my-3 border border-dark" /> : ""}

                </> : ""}

                {modalData.steptwourl || modalData.imagetwo ? <>

                    <h4 className="text-decoration-underline my-3">Step 2:  Enter your Details and the Redirect URL which is given below.</h4>
                    {/* <a href={modalData.steptwourl} target="_blank"  >{modalData.steptwourl} </a> */}
                    <a
                        href={`${Config.base_url + modalData.steptwourl}`}
                        target="_blank"
                    >
                        {`${Config.base_url + modalData.steptwourl}`}
                    </a>
                    <br />
                    {modalData.imagetwo ? <img src={modalData.imagetwo} alt="" class="w-100 border border-dark" /> : ""}
                </> : ""}

                {modalData.imagethree || modalData.imagethree ? <>
                    <h4 className="text-decoration-underline my-3">Step 3:  Create API</h4>
                    <a href={modalData.stepthreeurl} target="_blank"  >{modalData.stepthree} </a><br />
                    {modalData.imagethree ? <img src={modalData.imagethree} alt="" class="w-100 border border-dark" /> : ""}
                </> : ""}


                {modalData.note ?
                    <ul>
                        {modalData.note && modalData.note.split("\n").map((line, index) => (
                            <>
                                <li className=" h3 text-alert mt-3 text-info" key={index}>{line}</li><br />
                            </>
                        ))}
                    </ul>
                    : ""
                }
                {/* {modalData.note ?
                    <h3 className="text-alert my-3 text-info">NOTE- {modalData.note}</h3>
                    : ""} */}

                {modalData.youtubeurl ?
                    <>
                        <h4 className="text-decoration-underline mt-3">For your convenience, we have made these videos available for you to watch.</h4>
                        <a href={modalData.youtubeurl} target="_blank" className="btn btn-primary mx-3" >Youtube</a>
                    </>
                    : ""}



            </Modal>

        </Content>
        )
    </>
}


export default ApiCreateInfo