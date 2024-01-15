
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'

import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
 
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from "lucide-react";
import { useLocation } from 'react-router-dom';
import { Get_All_Subadmin_Client } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice';
import { DELETE_USER_SERVICES} from "../../../ReduxStore/Slice/Admin/AdminSlice";
import toast, { Toaster } from 'react-hot-toast';






const ClientList = () => {


    const dispatch = useDispatch()
    const [ShowClients, setshowClients] = useState([])
    const [refresh, setrefresh] = useState(false);

    let location = useLocation();
    console.log("=>", location.state._id)


  

    const GetAllClients = async () => {
        await dispatch(Get_All_Subadmin_Client({ id: location.state._id })).unwrap()
            .then((response) => {
                if (response.status) {
                    setshowClients(
                        response.data
                    );
                }
            })
    }

    const Delete_user = async (id) => {
        var req1 = {
          id: id,
        };
        if (window.confirm("Do you want to delete this User ?")) {
          await dispatch(DELETE_USER_SERVICES(req1))
            .unwrap()
            .then((response) => {
              if (response.status) {
                toast.success(response.msg);
    
                setrefresh(!refresh);
              } else {
                toast.error(response.msg);
    
              }
            });
        } else {
          return
        }
      };


    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'UserName',
            text: 'User Name'
        }, {
            dataField: 'Email',
            text: 'Email'
        },
        {
            dataField: 'PhoneNo',
            text: 'Phone Number'
        },

        {
            dataField: "actions",
            text: "Actions",
            formatter: (cell, row) => (
              <div style={{ width: "120px" }}>
                <div>
                  <Link to={`/admin/client/edit/${row._id}`} state={row}>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                      <Pencil
                        size={20}
                        color="#198754"
                        strokeWidth={2}
                        className="mx-1"
                      />
                    </span>
                  </Link>
            
                  <Link>
                    <span data-toggle="tooltip" data-placement="top" title="Delete">
                      <Trash2
                        size={20}
                        color="#d83131"
                        strokeWidth={2}
                        className="mx-1"
                        onClick={(e) => Delete_user(row._id)}
                      />
                    </span>
                  </Link>
                   {/* : ""}  */}
      
                </div>
              </div>
            ),
          },


    ];


    useEffect(() => {
        GetAllClients()
    }, [])


    // console.log("ShowClients", ShowClients )

    return (
        <>
            <Content Page_title="Sub Admin List" button_status={true} button_title='Back' route='/super/permitions'>
                {ShowClients.data ?
                    <FullDataTable TableColumns={columns} tableData={ShowClients.data} />
                    : 
                    <FullDataTable TableColumns={columns} tableData={[]} />
                    }
            </Content>
        </ >
    )

}


export default ClientList
