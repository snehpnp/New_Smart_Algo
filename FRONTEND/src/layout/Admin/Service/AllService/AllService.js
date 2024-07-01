import React, { useEffect, useState } from 'react';
import Content from '../../../../Components/Dashboard/Content/Content';
import Loader from '../../../../Utils/Loader';
import FullDataTable from '../../../../Components/ExtraComponents/Datatable/FullDataTable';
import { Get_All_Catagory, Service_By_Catagory } from '../../../../ReduxStore/Slice/Admin/AdminSlice';
import { useDispatch } from 'react-redux';

const ServicesList = () => {
  const dispatch = useDispatch();
  const [first, setFirst] = useState('CF');
  const [allServices, setAllServices] = useState({ loading: true, data: [] });
  const [filteredServices, setFilteredServices] = useState({ loading: true, data: [] });
  const [categoryData, setCategoryData] = useState({ loading: true, data: [] });
  const [searchInput, setSearchInput] = useState('');

  const getCategories = async () => {
    await dispatch(Get_All_Catagory()).unwrap().then((response) => {
      if (response.status) {
        setCategoryData({
          loading: false,
          data: response.data,
        });
      }
    });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getData = async () => {
    await dispatch(Service_By_Catagory({ segment: first })).unwrap().then((response) => {
      if (response.status) {
        setAllServices({
          loading: false,
          data: response.data,
        });
        setFilteredServices({
          loading: false,
          data: response.data,
        });
      } else {
        setAllServices({
          loading: false,
          data: [],
        });
        setFilteredServices({
          loading: false,
          data: [],
        });
      }
    });
  };

  useEffect(() => {
    getData();
  }, [first]);

  const columns = [
    {
      dataField: 'index',
      text: 'SR. No.',
      sort: true,
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: 'category.name',
      text: 'Category',
      sort: true,
    },
    {
      dataField: 'name',
      text: 'Service Name',
      sort: true,
    },
    {
      dataField: 'category.segment',
      text: 'Segment',
      sort: true,
    },
  ];

  useEffect(() => {
    const filteredData = allServices.data.filter((item) => {
      return item.name.toLowerCase().includes(searchInput.toLowerCase());
    });
    setFilteredServices({
      loading: false,
      data: searchInput ? filteredData : allServices.data,
    });
  }, [searchInput, allServices]);

  return (
    <>
      {allServices.loading ? (
        <Loader />
      ) : (
        <>
          <Content Page_title="All Services" button_status={false}>
            <div className="d-flex">
              <div className="col-lg-6" style={{ display: 'flex' }}>
                <div className="mb-3 row">
                  <div className="col-lg-7">
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
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-control"
                    id="exampleFormControlInput1"
                  />
                </div>
              </div>
            </div>
            <FullDataTable TableColumns={columns} tableData={filteredServices.data} />
          </Content>
        </>
      )}
    </>
  );
};

export default ServicesList;
