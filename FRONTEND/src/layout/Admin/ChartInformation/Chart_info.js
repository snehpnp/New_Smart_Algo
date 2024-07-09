// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_BROKER_INFORMATIONS, UPDATE_BROKER_INFORMATIONS, FIND_BROKER_RESPONSES } from '../../../ReduxStore/Slice/Admin/DashboardSlice'
import { useDispatch } from "react-redux";
import { fDate } from "../../../Utils/Date_formet";
import Modal from '../../../Components/ExtraComponents/Modal';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import toast from 'react-hot-toast';







const Chart_info = () => {




}


export default Chart_info;


