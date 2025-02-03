import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import Loader from "../../../../Utils/Loader";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import {
  Get_All_Catagory,
  Service_By_Catagory,
} from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";

const ServicesList = () => {
  const dispatch = useDispatch();
  const [first, setFirst] = useState("CF");
  const [allServices, setAllServices] = useState({ loading: true, data: [] });
  const [filteredServices, setFilteredServices] = useState({
    loading: true,
    data: [],
  });
  const [categoryData, setCategoryData] = useState({ loading: true, data: [] });
  const [searchInput, setSearchInput] = useState("");

  const getCategories = async () => {
    try {
      const response = await dispatch(Get_All_Catagory()).unwrap();
      if (response.status) {
        setCategoryData({ loading: false, data: response.data });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryData({ loading: false, data: [] });
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getData = async () => {
    try {
      const response = await dispatch(
        Service_By_Catagory({ segment: first })
      ).unwrap();
      if (response.status) {
        setAllServices({ loading: false, data: response.data });
        setFilteredServices({ loading: false, data: response.data });
      } else {
        setAllServices({ loading: false, data: [] });
        setFilteredServices({ loading: false, data: [] });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setAllServices({ loading: false, data: [] });
      setFilteredServices({ loading: false, data: [] });
    }
  };

  useEffect(() => {
    getData();
  }, [first]);

  const columns = [
    {
      dataField: "index",
      text: "SR. No.",
      sort: true,
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "category.name",
      text: "Category",
      sort: true,
    },
    {
      dataField: "name",
      text: "Service Name",
      sort: true,
    },
    {
      dataField: "category.segment",
      text: "Segment",
      sort: true,
    },
  ];

  const handleSearch = debounce((e) => {
    const filteredData = allServices.data.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredServices({
      loading: false,
      data: e.target.value ? filteredData : allServices.data,
    });
  }, 500);

  return (
    <>
      <Content Page_title="All Services" button_status={false}>
        <div className="row">
          <div className="col-lg-6" style={{ display: "flex" }}>
            <select
              className="default-select wide form-control"
              id="validationCustom05"
              onChange={(e) => setFirst(e.target.value)}
              value={first}
            >
              <option disabled>Please Select Category</option>
              <option value="all">All</option>
              {categoryData.data &&
                categoryData.data.map((item) => (
                  <option key={item.segment} value={item.segment}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-lg-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearch(e);
              }}
            />
          </div>
        </div>

        {allServices.loading || categoryData.loading ? (
          <Loader />
        ) : (
          <FullDataTable
            TableColumns={columns}
            tableData={filteredServices.data}
          />
        )}
      </Content>
    </>
  );
};

export default ServicesList;
