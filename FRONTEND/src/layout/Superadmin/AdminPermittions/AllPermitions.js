import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import { Link } from "react-router-dom";
import Loader from "../../../Utils/Loader";
import {
  FolderLock,
  Plus,
  FileClock,
  HelpingHand,
  Users2,
  Link2,
  ScrollText,
  RadioTower,
  Eye,
} from "lucide-react";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import { All_Panel_List } from "../../../ReduxStore/Slice/Superadmin/SuperAdminSlice";
import { useDispatch } from "react-redux";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import SidebarPermission from "./Sidebar_permission";
import PanelDetails from "./PanelDetails";
import AddLicence from "./Add_Licence";
import Adjust_Month from "./Adjust_Month";
import LicenceDetails from "./LicenceDetails";
import BrokerPermittion from "./Broker_Permittion";
import { fDateTimeSuffix, dateFormate } from "../../../Utils/Date_formet";
import Modal from "../../../Components/ExtraComponents/Modal";
import { Get_Panel_History } from "../../../ReduxStore/Slice/Superadmin/SuperAdminSlice";

const AllPermitions = () => {
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [PanelDetailsModal, setPanelDetailsModal] = useState(false);
  const [showAddLicenceModal, setshowAddLicenceModal] = useState(false);
  const [showAdjustMonthModal, setshowAdjustMonthModal] = useState(false);
  const [showPanelName, setshowPanelName] = useState(false);
  const [showLicenceModal, setshowLicenceModal] = useState(false);
  const [showLicenceDetails, setshowLicenceDetails] = useState({});
  const [showBrokerModal, setshowBrokerModal] = useState(false);
  const [showBrokerDetails, setshowBrokerDetails] = useState("");
  const [HistoryStatus, SetHistoryStatus] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [panelData, setPanelData] = useState({ loading: true, data: [] });
  const [panelData1, setPanelData1] = useState({ loading: true, data: [] });
  const [panelInfo, setpanelInfo] = useState({ loading: true, data: [] });

  const data = async () => {
    await dispatch(All_Panel_List())
      .unwrap()
      .then((response) => {
        if (response.status) {
         

          setPanelData1({
            loading: false,
            data: response.data,
          });

          setPanelData({
            loading: false,
            data: response.data,
          });
        } else {
          setPanelData({
            loading: false,
            data: [],
          });
          setPanelData1({
            loading: false,
            data: [],
          });
        }
      })
      .catch((err) => {
        return;
      });
  };

  const Panel_Info = async (row) => {
    setshowLicenceDetails({
      id: row._id,
      db_url: row.backend_rul,
      db_name: row.db_name,
    });
    setshowLicenceModal(true);
  };

  const Panel_History = async (row) => {
    const response = await dispatch(Get_Panel_History()).unwrap();
    if (response.status) {
      var FilterData = response.data.filter(
        (data) => data.panal_name == row.panel_name
      );
      setFilteredData1(FilterData);
      SetHistoryStatus(true);
    } else {
    }
  };

  const setLocalStorage = (row) => {
    localStorage.setItem("RowData", row._id);
    localStorage.setItem("backend_rul", row.backend_rul);
    localStorage.setItem("panel_name", row.panel_name);
  };

  const handleLocalStorage = (row) => {
    localStorage.setItem("backend_rul", row.backend_rul);
    localStorage.setItem("panel_name", row.panel_name);
  };

  const columns = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "panel_name",
      text: "Panel Name",
      formatter: (cell, row) => (
        <span data-toggle="tooltip" data-placement="top" title="Panel Views">
          <Link to={`${row.domain}`} target="_blank" rel="noopener noreferrer">
            {row.panel_name}
          </Link>
        </span>
      ),
    },
    {
      dataField: "Broker",
      text: "Broker",
      formatter: (cell, row) => (
        <span
          data-toggle="tooltip"
          data-placement="top"
          title="Sidebar Permission"
        >
          <FolderLock
            size={20}
            color="#198754"
            strokeWidth={2}
            className="mx-1"
            onClick={(e) => {
              setshowBrokerModal(true);
              setshowBrokerDetails(row);
            }}
          />
        </span>
      ),
    },
    {
      dataField: "panel_name",
      text: "Permission",
      formatter: (cell, row) => (
        <span
          data-toggle="tooltip"
          data-placement="top"
          title="Sidebar Permission"
        >
          <FolderLock
            size={20}
            color="#198754"
            strokeWidth={2}
            className="mx-1"
            onClick={(e) => {
              setshowPanelName({
                rowdata: row,
                panel_name: row.panel_name,
                id: row._id,
                db_url: row.db_url,
                db_name: row.db_name,
                key: row.key,
              });
              setshowModal(true);
            }}
          />
        </span>
      ),
    },
    {
      dataField: "panel_name",
      text: "Licence Details",
      formatter: (cell, row) => (
        <span data-toggle="tooltip" data-placement="top" title="Panel Views">
          <FileClock
            size={20}
            color="#198754"
            strokeWidth={2}
            onClick={(e) => Panel_Info(row)}
            className="mx-1"
          />
        </span>
      ),
    },
    {
      dataField: "panel_name",
      text: "History",
      formatter: (cell, row) => (
        <span data-toggle="tooltip" data-placement="top" title="Panel Views">
          <FileClock
            size={20}
            color="#198754"
            strokeWidth={2}
            onClick={(e) => Panel_History(row)}
            className="mx-1"
          />
        </span>
      ),
    },

    {
      dataField: "panel_name",
      text: "Clients",
      formatter: (cell, row) => (
        <span
          data-toggle="tooltip"
          data-placement="top"
          title="Panel Views"
          onClick={() => setLocalStorage(row)}
        >
          <Link to={`/super/showclient`} state={row}>
            <Users2
              size={20}
              color="#198754"
              strokeWidth={2}
              className="mx-1"
            />
          </Link>
        </span>
      ),
    },

    {
      dataField: "panel_name",
      text: "Subadmins",
      formatter: (cell, row) => (
        <span data-toggle="tooltip" data-placement="top" title="Panel Views">
          <Link to="/super/subadminlist" state={row}>
            <Users2
              size={20}
              color="#198754"
              strokeWidth={2}
              className="mx-1"
            />
          </Link>
        </span>
      ),
    },
    {
      dataField: "panel_name",
      text: "Add Licence",
      formatter: (cell, row) => (
        <span data-toggle="tooltip" data-placement="top" title="Add Licence">
          <Plus
            size={20}
            color="#198754"
            strokeWidth={2}
            className="mx-1"
            onClick={(e) => {
              setshowPanelName({
                panel_name: row.panel_name,
                id: row._id,
                db_url: row.db_url,
                db_name: row.db_name,
                key: row.key,
              });
              setshowAddLicenceModal(true);
            }}
          />
        </span>
      ),
    },

    {
      dataField: "panel_name",
      text: "Adjust Month",
      formatter: (cell, row) => (
        <span data-toggle="tooltip" data-placement="top" title="Adjust Month">
          <Plus
            size={20}
            color="#198754"
            strokeWidth={2}
            className="mx-1"
            onClick={(e) => {
              setshowPanelName({
                panel_name: row.panel_name,
                id: row._id,
                db_url: row.db_url,
                db_name: row.db_name,
                key: row.key,
              });
              setshowAdjustMonthModal(true);
            }}
          />
        </span>
      ),
    },
    {
      dataField: "panel_name",
      text: "Month Date",
      formatter: (cell, row) => (
        <span data-toggle="tooltip" data-placement="top" title="Month">
          {row.month_ago_number != undefined && row.month_ago_number != null
            ? ` ${row.month_ago_number} Month  ${
                row.month_ago_date.includes("T")
                  ? row.month_ago_date.split("T")[0]
                  : row.month_ago_date
              } `
            : " - "}
        </span>
      ),
    },
    {
      dataField: "signal",
      text: "Signal ",
      formatter: (cell, row) => (
        <span
          data-toggle="tooltip"
          data-placement="top"
          title="HelpingHand"
          onClick={() => handleLocalStorage(row)}
        >
          <Link to="/super/signals" state={row}>
            <RadioTower
              size={20}
              color="#198754"
              strokeWidth={2}
              className="mx-1"
            />
          </Link>
        </span>
      ),
    },
  ];

  const columns1 = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "panal_name",
      text: "Panel Name",
    },
    {
      dataField: "superadmin_name",
      text: "Super Admin Name",
    },
    {
      dataField: "client_id",
      text: "Client Id",
      formatter: (cell, row, rowIndex) => (
        <div>{cell == null ? "-" : cell}</div>
      ),
    },
    {
      dataField: "msg",
      text: "Message",
    },
    {
      dataField: "createdAt",
      text: "Date & Time",
      formatter: (cell, row, rowIndex) => <div>{fDateTimeSuffix(cell)}</div>,
      sort: true,
    },
  ];

  useEffect(() => {
    if (panelData1 && panelData1.data) {
      const filterData =
        panelData1.data &&
        panelData1.data.filter((item) => {
          const matchSearch =
            searchInput == "" ||
            item.panel_name.toLowerCase().includes(searchInput.toLowerCase());

          return matchSearch;
        });
      setPanelData({
        loading: false,
        data: filterData,
      });
    } else {
      setPanelData({
        loading: false,
        data: [],
      });
    }
  }, [searchInput]);

  useEffect(() => {
    localStorage.removeItem("RowData");
    localStorage.removeItem("backend_rul");
    data();
  }, []);

  return (
    <>
      {panelData.loading ? (
        <Loader />
      ) : (
        <>
          <Content Page_title="Admin Permission" button_status={false}>
            <div className="mb-4">
              <h6>Search here something</h6>
              <input
                type="text"
                style={{ height: "2rem" }}
                placeholder="search..."
                className="p-2 rounded"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                value={searchInput}
              />
            </div>
            {panelData.data && panelData.data.length === 0 ? (
              "No data found"
            ) : (
              <>
                <SidebarPermission
                  showPanelName={showPanelName}
                  showModal={showModal}
                  setshowModal={() => setshowModal(false)}
                />
                <BrokerPermittion
                  List={showBrokerDetails}
                  showModal={showBrokerModal}
                  setshowModal={() => setshowBrokerModal(false)}
                />
                <PanelDetails
                  showModal={PanelDetailsModal}
                  data={panelInfo && panelInfo}
                  setshowModal={() => setPanelDetailsModal(false)}
                />
                <AddLicence
                  showPanelName={showPanelName}
                  showModal={showAddLicenceModal}
                  setshowModal={() => setshowAddLicenceModal(false)}
                />

                <Adjust_Month
                  showPanelName={showPanelName}
                  showModal={showAdjustMonthModal}
                  setshowModal={() => setshowAdjustMonthModal(false)}
                />

                {showLicenceModal && (
                  <LicenceDetails
                    id={showLicenceDetails}
                    showModal={showLicenceModal}
                    setshowModal={() => setshowLicenceModal(false)}
                  />
                )}

                <FullDataTable
                  TableColumns={columns}
                  tableData={panelData.data}
                  pagination1={false}
                />
                <ToastButton />
              </>
            )}

            {HistoryStatus && (
              <div>
                <Modal
                  isOpen={true}
                  size="xl"
                  title="History"
                  hideBtn={true}
                  handleClose={() => SetHistoryStatus(false)}
                >
                  <FullDataTable
                    TableColumns={columns1}
                    tableData={filteredData1}
                  />
                </Modal>
              </div>
            )}
          </Content>
        </>
      )}
    </>
  );
};

export default AllPermitions;
