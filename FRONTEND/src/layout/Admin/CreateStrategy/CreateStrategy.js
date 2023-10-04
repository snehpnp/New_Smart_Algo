import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Content from "../../../Components/Dashboard/Content/Content";
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import Loader from "../../../Utils/Loader";
import { fa_time, fDateTimeSuffix } from "../../../Utils/Date_formet";
import { Pencil, Trash2 } from "lucide-react";
import { Get_All_Signals } from "../../../ReduxStore/Slice/Admin/SignalsSlice";
import { useDispatch, useSelector } from "react-redux";

const Signals = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <>
        <Content Page_title="All Services" button_status={false}>
          <div>
            <Modal show={show} onHide={handleClose} className=" right">
              <Modal.Header>
                <input
                  type="seacrh"
                  className="form-control"
                  placeholder=" Search Stocks eg, SBIN"
                />
                <Button
                  variant="primary"
                  className="ms-2"
                  onClick={handleClose}
                >
                  Done
                </Button>
              </Modal.Header>
              <Modal.Body>
                <ul className="ps-0">
                  <li className="my-2">
                    <div className="row">
                      <div className="col-md-2">
                        <img
                          className="w-100 p-2"
                          src="https://upload.wikimedia.org/wikipedia/en/6/60/ACFTU_logo.png"
                        />
                      </div>
                      <div className="col-md-7 ps-0">
                        <h3 className="mb-0">ASAL</h3>
                        <p className="text-muted my-0">NSE</p>
                      </div>
                      <div className="col-md-3 d-flex list-btn">
                        <button
                          className="btn border-0"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Add Dynamic Contract"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className="btn border-0">
                          <i className="fa-regular fa-square-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div></div>
                  </li>
                  <li className="my-2">
                    <div className="row">
                      <div className="col-md-2">
                        <img
                          className="w-100 p-2"
                          src="https://upload.wikimedia.org/wikipedia/en/6/60/ACFTU_logo.png"
                        />
                      </div>
                      <div className="col-md-7 ps-0">
                        
                        <h3 className="mb-0">ASAL</h3>
                        <p className="text-muted my-0">NSE</p>
                      </div>
                      <div className="col-md-3 d-flex list-btn">
                        <button
                          className="btn border-0"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Add Dynamic Contract"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className="btn border-0">
                          <i className="fa-regular fa-square-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div></div>
                  </li>
                  <li className="my-2">
                    <div className="row">
                      <div className="col-md-2">
                        <img
                          className="w-100 p-2"
                          src="https://upload.wikimedia.org/wikipedia/en/6/60/ACFTU_logo.png"
                        />
                      </div>
                      <div className="col-md-7 ps-0">
                        
                        <h3 className="mb-0">ASAL</h3>
                        <p className="text-muted my-0">NSE</p>
                      </div>
                      <div className="col-md-3 d-flex list-btn">
                        <button
                          className="btn border-0"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Add Dynamic Contract"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className="btn border-0">
                          <i className="fa-regular fa-square-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div></div>
                  </li>
                </ul>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
            <ul class="StepProgress">
              <li class="StepProgress-item is-done">
                <strong>Instruments</strong>
                <div className="row">
                  <div className="col-md-2">
                    <button
                      className="btn btn-strategy"
                      variant="primary"
                      onClick={handleShow}
                    >
                      <i className="fa-solid fa-plus"></i>
                      <h5 className="mb-0">Add</h5>
                      <p className="mb-0">Stocks eg, SBIN</p>
                    </button>
                  </div>
                  <div className="col-md-2">
                    <div className="card card-strategy">
                      <div className="card-body">
                        <h4>
                          <span>
                            <img src="https://seeklogo.com/images/I/indraprastha-gas-logo-8CD9114819-seeklogo.com.png"></img>
                          </span>
                          IGL
                        </h4>
                        <p className="text-muted my-0">NSE</p>
                        <div className="d-flex justify-content-between my-1">
                          <i className="fa-solid fa-pen-to-square"></i>
                          <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <h3 className="text-success my-0 ">45.5</h3>
                        <p className="text-success my-0">%45.5</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card card-strategy">
                      <div className="card-body">
                        <h4>
                          <span>
                            <img src="https://seeklogo.com/images/I/indraprastha-gas-logo-8CD9114819-seeklogo.com.png"></img>
                          </span>
                          IGL
                        </h4>
                        <p className="text-muted my-0">NSE</p>
                        <div className="d-flex justify-content-between my-1">
                          <i className="fa-solid fa-pen-to-square"></i>
                          <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <h3 className="text-success my-0 ">45.5</h3>
                        <p className="text-success my-0">%45.5</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card card-strategy">
                      <div className="card-body">
                        <h4>
                          <span>
                            <img src="https://seeklogo.com/images/I/indraprastha-gas-logo-8CD9114819-seeklogo.com.png"></img>
                          </span>
                          IGL
                        </h4>
                        <p className="text-muted my-0">NSE</p>
                        <div className="d-flex justify-content-between my-1">
                          <i className="fa-solid fa-pen-to-square"></i>
                          <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <h3 className="text-success my-0 ">45.5</h3>
                        <p className="text-success my-0">%45.5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="StepProgress-item is-done">
                <div className="row">
                  <div className="col-md-3">
                    <div class="columns">
                      <label>Position I would take</label>
                      <div class="column is-12">
                        <div class="up-in-toggle">
                          <input
                            type="radio"
                            id="switch_left"
                            name="switch_2"
                            value="yes"
                          />
                          <label for="switch_left">Buy</label>
                          <input
                            type="radio"
                            id="switch_right"
                            name="switch_2"
                            value="no"
                            checked
                          />
                          <label for="switch_right">Sell</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6">
  <div className="card">
    <div className="">
      <label>Candle Interval</label>
    </div>
    <div className="card-body px-0 pt-0">
      <ul className="nav nav-pills justify-content-between mb-4">
        <li className=" nav-item">
          <a
            href="#navpills2-1"
            className="nav-link"
            data-bs-toggle="tab"
            aria-expanded="false"
          >
            min
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#navpills2-2"
            className="nav-link"
            data-bs-toggle="tab"
            aria-expanded="false"
          >
            3 min
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#navpills2-3"
            className="nav-link active"
            data-bs-toggle="tab"
            aria-expanded="true"
          >
            5 min
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#navpills2-4"
            className="nav-link "
            data-bs-toggle="tab"
            aria-expanded="true"
          >
           10 min
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#navpills2-5"
            className="nav-link "
            data-bs-toggle="tab"
            aria-expanded="true"
          >
            15 min
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#navpills2-6"
            className="nav-link "
            data-bs-toggle="tab"
            aria-expanded="true"
          >
            30 min 
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#navpills2-7"
            className="nav-link "
            data-bs-toggle="tab"
            aria-expanded="true"
          >
            hour
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#navpills2-8"
            className="nav-link "
            data-bs-toggle="tab"
            aria-expanded="true"
          >
            day
          </a>
        </li>
      </ul>
      <div className="tab-content">
        <div id="navpills2-1" className="tab-pane">
          <div className="row">
            <div className="col-md-12">
              
              Raw denim you probably haven't heard of them jean shorts Austin.
              Nesciunt tofu stumptown aliqua, retro synth master cleanse.
              Mustache cliche tempor, williamsburg carles vegan helvetica.
              <p>
                <br /> Reprehenderit butcher retro keffiyeh dreamcatcher synth.
                Cosby sweater eu banh mi, qui irure terry richardson ex squid.
              </p>
            </div>
          </div>
        </div>
        <div id="navpills2-2" className="tab-pane">
          <div className="row">
            <div className="col-md-12">
              
              Raw denim you probably haven't heard of them jean shorts Austin.
              Nesciunt tofu stumptown aliqua, retro synth master cleanse.
              <p>
                <br /> Reprehenderit butcher retro keffiyeh dreamcatcher synth.
                Cosby sweater eu banh mi, qui irure terry richardson ex squid.
              </p>
            </div>
          </div>
        </div>
        <div id="navpills2-3" className="tab-pane active">
          <div className="row">
            <div className="col-md-12">
              
              
              <p>
                <br /> Reprehenderit butcher retro keffiyeh dreamcatcher synth.
                Cosby sweater eu banh mi, qui irure terry richardson ex squid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Quantity ( in lots )</label>
                      <input type="number" className="form-control"></input>
                    </div>
                  </div>
                </div>
              </li>
              <li class="StepProgress-item current is-done">
                <strong>Entry Condition</strong>
              </li>

              <li class="StepProgress-item">
                <strong>Exit Condition</strong>
                <div className="row mt-3">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="text-danger">Stop loss %</label>
                      <input type="text" className="form-control"></input>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="text-success">Tarhet Profit %</label>
                      <input type="text" className="form-control"></input>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="">Trailing SL % (optional)</label>
                      <input type="text" className="form-control"></input>
                    </div>
                  </div>
                </div>
              </li>
              <li class="StepProgress-item">
                <strong>Handover</strong>
              </li>
            </ul>
          </div>
        </Content>
      </>
    </>
  );
};

export default Signals;
