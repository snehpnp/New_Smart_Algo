import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import Loader from "../../../Utils/Loader";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import {
  GetAllSignal,
  Update_Price,
  DeleteSignal,
} from "../../../ReduxStore/Slice/Superadmin/SuperAdminSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { fDateTime } from "../../../Utils/Date_formet";

const AdminHelps = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();
  const UserName = JSON.parse(localStorage.getItem("user_details")).UserName;
  const token = JSON.parse(localStorage.getItem("user_details")).token;
  const backend_rul = localStorage.getItem("backend_rul");
  const panel_name = localStorage.getItem("panel_name");
  const [showModal, setShowmodal] = useState(false);
  const [showModal1, setShowmodal1] = useState(false);
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [entryPriceId, setEntryPriceId] = useState("");
  const [exitPriceId, setExitPriceId] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [signalId, setSignalId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [getAllSignals, setAllSignals] = useState({ loading: true, data: [] });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    data();
  }, [refresh, inputSearch,toDate,fromDate]);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };
  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const updatePrice = async () => {
    const data = {
      id: entryPriceId,
      price: entryPrice,
      signalId: signalId,
      entryPriceID: 1,
      backend_rul: backend_rul,
      superadmin_name: UserName,
      panel_name: panel_name,
    };
    try {
      const response = await dispatch(Update_Price(data)).unwrap();
      if (response.status) {
        setRefresh(!refresh);
        setShowmodal(false);
        setEntryPriceId("");
        setSignalId("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateExitPrice = async () => {
    const data = {
      id: exitPriceId,
      price: exitPrice,
      signalId: signalId,
      entryPriceID: 2,
      backend_rul: backend_rul,
      superadmin_name: UserName,
      panel_name: panel_name,
    };
    await dispatch(Update_Price(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setRefresh(!refresh);
          setShowmodal1(false);
          setExitPriceId("");
          setSignalId("");
        }
      })
      .catch((err) => {
        return;
      });
  };

  const data = async () => {
    await dispatch(GetAllSignal({ backend_rul: backend_rul,toDate:toDate,fromDate:fromDate }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          const filterData = response.data.filter((item) => {
            const inputSearchMetch =
              inputSearch == "" ||
              item.symbol.toLowerCase().includes(inputSearch.toLowerCase()) ||
              item.entry_type
                .toLowerCase()
                .includes(inputSearch.toLowerCase()) ||
              item.exit_type
                .toLowerCase()
                .includes(inputSearch.toLowerCase()) ||
              item.strategy.toLowerCase().includes(inputSearch.toLowerCase()) ||
              item.entry_price
                .toLowerCase()
                .includes(inputSearch.toLowerCase()) ||
              item.exit_price.toLowerCase().includes(inputSearch.toLowerCase());

            return inputSearchMetch;
          });

          setAllSignals({
            loading: false,
            data: inputSearch ? filterData : response.data,
          });
        } else {
          setAllSignals({
            loading: false,
            data: [],
          });
        }
      });
  };

  const columns = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "symbol",
      text: "Symbol",
    },
    {
      dataField: "strategy",
      text: "Strategy",
    },
    {
      dataField: "entry_type",
      text: "Entry Type",
    },
    {
      dataField: "entry_price",
      text: "Entry Price",
      formatter: (cell, row) => (
        <span
          onClick={() => {
            setShowmodal(true);
            setEntryPrice(cell);
            setEntryPriceId(row._id);
            setSignalId(row.signals_id);
          }}
        >
          {cell ? cell : "-"}
        </span>
      ),
    },
    {
      dataField: "exit_price",
      text: "Exit Price",
      formatter: (cell, row) => (
        <span
          onClick={() => {
            setShowmodal1(true);
            setExitPrice(cell);
            setExitPriceId(row._id);
            setSignalId(row.signals_id);
          }}
        >
          {cell ? cell : "-"}
        </span>
      ),
    },
    {
      dataField: "entry_qty",
      text: "Entry Quantity",
    },
    {
      dataField: "createdAt",
      text: "Date",
      formatter: (cell, row) => (
        // <><div>{cell.split('T')[0] + "   " + cell.split('T')[1].split('.')[0]}</div> </>
        <>
          <div>{fDateTime(cell)}</div>{" "}
        </>
      ),
    },
    {
      dataField: "",
      text: "Action",
      formatter: (cell, row) => (
        <>
          <Trash2 onClick={() => handleDelete(row._id)} />
        </>
      ),
    },
  ];

  const handleBackupBtn = () => {
    navigate("/super/backupsignal");
  };

  const handleDelete = async (id) => {
    // Show confirmation dialog
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirmResult.isConfirmed) {
      return;
    }

    const data = { id, backend_rul, superadmin_name: UserName, panel_name };

    try {
      const response = await dispatch(DeleteSignal(data)).unwrap();

      if (response.status) {
        toast.success("User deleted successfully");
        setRefresh(!refresh); // Refresh data
      } else {
        toast.error("An error occurred during deletion");
      }
    } catch (err) {
      toast.error("Error deleting user, please try again.");
      console.error("Deletion error:", err); // Log error for debugging
    }
  };

  return (
    <>
      {getAllSignals.loading ? (
        <Loader />
      ) : (
        <>
          <Content
            Page_title="Signal"
            button_status={true}
            button_title="Back"
            route="/super/permitions"
          >
       <div className="row d-flex align-items-center justify-content-start">

       <div className="col-lg-2 px-1">
    <div className="form-group mb-3">
      <label htmlFor="searchInput" className="col-lg-12">
        Search
      </label>
      <input
        type="text"
        name="searchInput"
        id="searchInput"
        className="form-control p-2 rounded border"
        placeholder="Search here..."
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
        aria-label="Search Input"
      />
    </div>
  </div>

  <div className="col-lg-2 px-1">
    <div className="form-group mb-3">
      <label htmlFor="fromdate" className="col-lg-12">
        From Date
      </label>
      <input
        type="date"
        name="fromdate"
        className="form-control"
        id="fromdate"
        value={fromDate}
        onChange={handleFromDateChange}
        aria-label="Select From Date"
      />
    </div>
  </div>
  
  <div className="col-lg-2 px-1">
    <div className="form-group mb-3">
      <label htmlFor="endDate" className="col-lg-12">
        To Date
      </label>
      <input
        type="date"
        name="endDate"
        className="form-control"
        id="endDate"
        value={toDate}
        onChange={handleToDateChange}
        min={fromDate}
        aria-label="Select To Date"
      />
    </div>
  </div>



  <div className="col-lg-2 px-1">
    <div className="form-group mb-3">
      <label className="col-lg-12">
        Backup Signal
      </label>
      <button
        className="btn btn-primary w-100"
        onClick={handleBackupBtn}
        aria-label="Backup Signal Button"
      >
        Backup Signal
      </button>
    </div>
  </div>
</div>

            <FullDataTable
              TableColumns={columns}
              tableData={getAllSignals.data}
              pagination1={false}
            />
          </Content>
        </>
      )}

      {showModal && (
        <div
          className="modal custom-modal d-block"
          id="add_vendor"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Update Price</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setShowmodal(false);
                    setEntryPriceId("");
                    setSignalId("");
                  }}
                ></button>
              </div>
              <div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="input-block mb-3">
                        <label>Entry Price</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter entry price"
                          onChange={(e) => setEntryPrice(e.target.value)}
                          value={entryPrice}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-back cancel-btn me-2"
                    onClick={(e) => {
                      setShowmodal(false);
                      setEntryPriceId("");
                      setSignalId("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary paid-continue-btn"
                    onClick={() => updatePrice()}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal1 && (
        <div
          className="modal custom-modal d-block"
          id="add_vendor"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Update Price</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setShowmodal1(false);
                    setExitPriceId("");
                    setSignalId("");
                  }}
                ></button>
              </div>
              <div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="input-block mb-3">
                        <label>Entry Price</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter entry price"
                          onChange={(e) => setExitPrice(e.target.value)}
                          value={exitPrice}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-back cancel-btn me-2"
                    onClick={(e) => {
                      setShowmodal1(false);
                      setExitPriceId("");
                      setSignalId("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary paid-continue-btn"
                    onClick={() => updateExitPrice()}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHelps;
