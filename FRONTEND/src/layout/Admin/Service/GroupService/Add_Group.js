import React, { useEffect, useState } from "react";
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form2";
import { useFormik } from "formik";
import * as valid_err from "../../../../Utils/Common_Messages";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Content from "../../../../Components/Dashboard/Content/Content1";
import {
  Get_All_Catagory,
  Service_By_Catagory,
} from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import toast from "react-hot-toast";
import { Add_Group } from "../../../../ReduxStore/Slice/Admin/GroupServiceSlice";
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
import { Trash2 } from "lucide-react";
import { No_Negetive_Input_regex } from "../../../../Utils/Common_regex";

const AddStrategy = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

  const [state, setstate] = useState([]);
  const [SerachService, setSerachService] = useState("");
  const [GetAllSgments, setGetAllSgments] = useState({
    loading: true,
    data: [],
  });
  const [allServices, setAllServices] = useState({
    loading: true,
    data: [],
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [GroupQty, setGroupQty] = useState([]);
  const [selectAllFiltered, setSelectAllFiltered] = useState(false);

  const formik = useFormik({
    initialValues: {
      groupname: "",
      segment: false,
    },
    validate: (values) => {
      const errors = {};
      if (!values.groupname) {
        errors.groupname = valid_err.EMPTY_GROUP_NAME_ERR;
      }
      if (!values.segment) {
        errors.segment = valid_err.SEGEMENTSELECT_ERROR;
      }

      return errors;
    },
    onSubmit: async (values) => {
      let checkValid = true;

      if (selectedServices.length == 0) {
        toast.error("Please Select Atleast one service");
        return;
      }
      selectedServices &&
        selectedServices.map((item) => {
          if (item.lotsize !== 1) {
            if (item.group_qty % item.lotsize !== 0) {
              alert(`Please Enter Valid Lot Size Inside ${item.name}`);
              checkValid = false;
              return;
            }
            return;
          }
          return;
        });

      if (checkValid) {
        await dispatch(
          Add_Group({
            groupdetails: { name: values.groupname },
            services_id: selectedServices,
          })
        ).then((response) => {
          if (response.payload.status) {
            toast.success(response.payload.msg);
            setTimeout(() => {
              navigate("/admin/groupservices");
            }, 1000);
          } else {
            toast.error(response.payload.msg);
          }
        });
      }
    },
  });

  useEffect(() => {
    getservice();
  }, []);

  useEffect(() => {
    filterFunction();
  }, [SerachService]);

  useEffect(() => {
    data();
  }, [formik.values.segment]);

  useEffect(() => {
    setSerachService("");
    setSelectAllFiltered(false);
  }, [formik.values.segment]);

  function handleServiceChange(event, id, name, segment, lotsize,instrumenttype) {
    const serviceId = id;
    const isChecked = event.target.checked;

    setSelectedServices((prevInfo) => {
      if (isChecked) {
        return [
          ...prevInfo,
          {
            service_id: serviceId,
            name: name,
            segment: segment,
            group_qty: 0,
            lotsize: lotsize,
            product_type:instrumenttype =="OPTSTK" ? 1 : 2

          },
        ];
      } else {
        return prevInfo.filter((info) => info.service_id !== serviceId);
      }
    });
  }

  const handleSelectAllFilteredChange = () => {
    setSelectAllFiltered((prevChecked) => !prevChecked);

    if (!selectAllFiltered) {
      const updatedServices = state.map((service) => ({
        service_id: service._id,
        name: service.name,
        segment: service.category.name,
        group_qty: 0,
        lotsize: service.lotsize,
        product_type:2
      }));

      state.forEach((service) => {
        const checkboxes = document.querySelectorAll(`#service-${service._id}`);
        checkboxes.forEach((checkbox) => {
          checkbox.checked = true;
        });
      });

      setSelectedServices((prevInfo) => [...prevInfo, ...updatedServices]);
    } else {
      const filteredServiceIds = state.map((service) => service._id);
      setSelectedServices((prevInfo) =>
        prevInfo.filter((info) => !filteredServiceIds.includes(info.service_id))
      );

      state.forEach((service) => {
        const checkboxes = document.querySelectorAll(`#service-${service._id}`);
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      });
    }
  };

  const InputGroupQty = (event, id, servicename, segment, lotsize) => {
    const updatedQty =
      event.target.value === "" ? 0 : parseInt(event.target.value);

    setSelectedServices((prevInfo) =>
      prevInfo.map((info) =>
        info.service_id === id
          ? {
              ...info,
              group_qty: updatedQty,
            }
          : info
      )
    );

    // Update the quantity in the GroupQty array
    setGroupQty((prevQtys) => [
      ...prevQtys.filter((qtyInfo) => qtyInfo.service_id !== id),
      {
        service_id: id,
        segment: segment,
        name: servicename,
        group_qty: updatedQty,
      },
    ]);
  };

  const remoeveService = (id) => {
    if (window.confirm("Do you want to delete")) {
      let test = selectedServices.filter((item) => {
        return item.service_id !== id;
      });
      let checkboxes = document.querySelectorAll(`#service-${id}`);
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });

      setSelectedServices(test);
    }
  };

  const getservice = async () => {
    await dispatch(Get_All_Catagory())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setGetAllSgments({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  const data = async () => {
    if (formik.values.segment) {
      await dispatch(Service_By_Catagory({ segment: formik.values.segment }))
        .unwrap()
        .then((response) => {
          if (response.status) {
            setAllServices({
              loading: false,
              data: response.data,
            });
          }
        });
    }
  };

  const filterFunction = async () => {
    const filteredData = allServices.data.filter((item) => {
      return item.name.toLowerCase().includes(SerachService.toLowerCase());
    });

    if (SerachService === "") {
      setstate([]);
    } else {
      setstate(filteredData);
    }
  };

  const fields = [
    {
      name: "groupname",
      label: "Group Name",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "segment",
      label: "Segment",
      type: "select",
      options:
        GetAllSgments.data &&
        GetAllSgments.data.map((item) => ({
          label: item.name,
          value: item.segment,
        })),
      label_size: 12,
      col_size: 6,
      disable: false,
    },
  ];

  const AddProductType = (id, e) => {
 
    setSelectedServices((prevServices) =>
        prevServices.map((service) =>
            service.service_id === id.service_id
            ? { ...service, product_type: e.target.value }
            : service
        )
    );
  };

  return (
    <>
      <Content
        Page_title="Add Group "
        button_title="Back"
        route="/admin/groupservices"
        additional_field={
          <div style={{ overflowY: "scroll", height: "65vh" }}>
            <h4 className="text-center text-decoration-underline mb-3">
              Select Services And Quantity
            </h4>
            <table className="table table-responsive-sm col-md-3 ">
              <thead className="bg-primary">
                <tr className="text-center">
                  <th>#</th>
                  <th>Segment</th>
                  <th>Service Name</th>
                  <th>lotsize</th>
                  <th>Quantity</th>
                  <th>Product Type</th>

                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {selectedServices &&
                  selectedServices.map((item, index) => {
                    return (
                      <>
                        <tr key={index + 1}>
                          <td>{index + 1}</td>
                          <td>{item.segment}</td>
                          <td>{item.name}</td>
                          <td>{item.lotsize}</td>

                          <td>
                            <input
                              type="number"
                              className="form-control col-md-1"
                              placeholder="Enter Qty"
                              value={item.group_qty}
                              onChange={(e) =>
                                InputGroupQty(
                                  e,
                                  item.service_id,
                                  item.name,
                                  item.segment,
                                  item.lotsize
                                )
                              }
                              min={0}
                            />
                          </td>
                          <td
                            onClick={(e) => AddProductType(item, e)}
                            className="text-danger"
                          >
                            <select className="form-select" defaultValue={item.product_type}>
                              <option value="" disabled>
                                Select Product Type
                              </option>
                              <option value="2">MIS</option>
                              <option value="1">CNC</option>
                              <option value="3">BO</option>
                              <option value="4">CO</option>
                            </select>
                          </td>
                          <td
                            onClick={() => {
                              remoeveService(item.service_id);
                            }}
                          >
                            <Trash2 className="text-danger" />
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        }
      >
        <Formikform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name="Add Group"
          title="addstrategy"
          additional_field={
            <>
              {formik.values.segment ? (
                <div className="col-md-11 px-2 ms-2 ">
                  <input
                    type="test"
                    className="form-control"
                    placeholder="Search ..."
                    onChange={(e) => {
                      setSerachService(e.target.value);
                    }}
                    value={SerachService}
                  />
                </div>
              ) : (
                ""
              )}
              <div
                className="col-lg-12"
                style={{ overflowY: "scroll", height: "50vh" }}
              >
                {state.length > 0 && (
                  <div className="mb-3 row">
                    <div className="col-lg-12">
                      <div className="row mt-4">
                        :
                        <>
                          <div className="col-md-4 mb-2">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="selectall"
                                checked={selectAllFiltered}
                                onChange={() => handleSelectAllFilteredChange()}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="selectall"
                              >
                                Select All
                              </label>
                            </div>
                          </div>
                          {state.map((service) => (
                            <div key={service._id} className="col-md-4 mb-2">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`service-${service._id}`}
                                  value={service._id}
                                  defaultChecked={selectedServices.includes(
                                    service._id
                                  )}
                                  onChange={(e) =>
                                    handleServiceChange(
                                      e,
                                      service._id,
                                      service.name,
                                      service.category.name,
                                      service.lotsize,
                                      service.instrumenttype

                                    )
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`service-${service._id}`}
                                >
                                  {service.name}
                                </label>
                              </div>
                            </div>
                          ))}
                        </>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          }
        />

        <ToastButton />
      </Content>
    </>
  );
};

export default AddStrategy;
