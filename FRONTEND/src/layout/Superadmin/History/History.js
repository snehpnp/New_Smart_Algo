/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react'
import TableWIthCustomPaginations from '../../../Components/ExtraComponents/Tables/TableWIthCustomPaginations'
import Content from '../../../Components/Dashboard/Content/Content'
import { All_Panel_List } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import Pagination from '../../../Components/ExtraComponents/Tables/pagination'

import { useDispatch, useSelector } from "react-redux";



const History = () => {
  const dispatch = useDispatch()
  const panellist = useSelector((state) => state.SuperAdminSlice)

  console.log("useSelector ", panellist);

  const [themeData, setThemeData] = useState({
    loading: true,
    data: []
  });

  console.log("themeData", themeData);

  const data = [];

  // Create 50 items
  for (let i = 1; i <= 50; i++) {
    data.push({
      id: i,
      name: i % 2 === 0 ? "mango" : "banana", // Alternating between mango and banana names
      price: Math.floor(Math.random() * 100) + 1, // Random price between 1 and 100
    });
  }


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // const data = tableData;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getpanelList = () => {
    const req = {
      "page": currentPage,
      "limit": "50"
    }

    dispatch(All_Panel_List(req))

  }

  useEffect(() => {
    getpanelList()
  }, [dispatch, currentPage])



  useEffect(() => {
    if (panellist !== undefined) {
      if (panellist && panellist.getPanelList) {
        setThemeData({
          loading: false,
          data: panellist.getPanelList
        });
      }
      // if (panellist !== undefined && panellist.gettheme.message === "Network Error") {
      //     alert(panellist.gettheme.message);
      // }
    }
  }, [panellist]);






  return (
    <div>
      <Content Page_title="TableWithIconButtons">
        {themeData.loading ? (
          // <Loader />
          <h6>loader</h6>
        ) : themeData.data && themeData.data.length === 0 ? (
          'No data found'
        ) : (
          <>
            <TableWIthCustomPaginations tableData={themeData && themeData.data.data} tableColumn={[]} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            // itemsPerPage = {itemsPerPage}
            />
          </>
        )}


      </Content >
    </div>
  )
}

export default History

// import React from 'react'

// const History = () => {
//   return (
//     <div>History</div>
//   )
// }

// export default History