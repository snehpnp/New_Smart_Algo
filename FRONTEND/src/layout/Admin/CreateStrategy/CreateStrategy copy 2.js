import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";
import Content from "../../../Components/Dashboard/Content/Content";
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import Loader from "../../../Utils/Loader";
import { fa_time, fDateTimeSuffix } from "../../../Utils/Date_formet";
import { No_Negetive_Input_regex } from "../../../Utils/Common_regex";
import { Pencil, Trash2 } from "lucide-react";
import { Get_All_Signals } from "../../../ReduxStore/Slice/Admin/SignalsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Get_All_Strategy } from "../../../ReduxStore/Slice/Admin/StrategySlice";
import {
  get_time_frame,
  get_source,
  get_comparators,
  Add_Make_Strategy,
  get_instrument,
} from "../../../ReduxStore/Slice/Common/make_strategy_slice";

import toast, { Toaster } from "react-hot-toast";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { useNavigate } from "react-router-dom";
import * as Config from "../../../Utils/Config";

const CreateStrategy = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user_Id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

  const [show, setShow] = useState(false);
  const user_role = JSON.parse(localStorage.getItem("user_role"));
  const [storeServiceData, setStoreServiceData] = useState([]);
  const [filterServices, setFilterServices] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [getIndicators, setGetIndicators] = useState([]);
  const [selectAddIndicators, setSelectAddIndicators] = useState([]);
  const [indicatorModalRowData, setIndicatorModalRowData] = useState([]);
  const [showEnterPrice, setShowEnterPrice] = useState(false);
  const [priceAction, setPriceAction] = useState("above");
  const [inputValue, setInputValue] = useState(0);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [strategyDataAllAdmin, setStrategyDataAllAdmin] = useState({
    loading: true,
    data: [],
  });
  const [selectStrategy, setSelectStrategy] = useState("");
  const [timeFrameData, setTimeFrameData] = useState({
    loading: true,
    data: [],
  });
  const [getSources, setGetSources] = useState({ loading: true, data: [] });
  const [getComparators, setGetComparators] = useState({
    loading: true,
    data: [],
  });
  const [disableSaveButtun, setDisableSaveButtun] = useState(false);
  const [strategyName, setStrategyName] = useState("");
  const [numberOfTrade, setNumberOfTrade] = useState("");
  const [maxProfit, setMaxProfit] = useState("");
  const [maxLoss, setMaxLoss] = useState("");
  const [timeFrameVal, setTimeFrameVal] = useState("");
  const [buyCheck, setBuyCheck] = useState(false);
  const [sellCheck, setSellCheck] = useState(false);
  const [coditionRequestArr, setCoditionRequestArr] = useState([]);
  const [coditionRequestArrSell, setCoditionRequestArrSell] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [selectConditionItem, setSelectConditionItem] = useState("");
  const [selectedElementFirsSecond, setSelectedElementFirsSecond] =
    useState("");
  const [offSetValue, setOffSetValue] = useState(0);
  const [selectedIndexConditionArr, setSelectedIndexConditionArr] =
    useState("");
  const [selectAndOrOperater, setSelectAndOrOperater] = useState("or");
  const [showModalOffset, setShowModalOffset] = useState(false);
  const [showModalAndOrOperator, setShowModalAndOrOperator] = useState(false);
  const [checkBuySellAndOr, setCheckBuySellAndOr] = useState("");
  const [exitConditionBuyOrSell, setExitConditionBuyOrSell] = useState([
    {
      buy: { stoploss: "0", target: "0", tsl: "0" },
      sell: { stoploss: "0", target: "0", tsl: "0" },
    },
  ]);
  const [timeTradeConddition, setTimeTradeConddition] = useState([
    { entry: { time: "" }, exit: { time: "" }, notrade: { time: "" } },
  ]);

  const selectTimeFrame = (item) => {
    setTimeFrameVal(item.value);
  };
  const handleCloseEnterPrice = () => setShowEnterPrice(false);
  const handleClose = () => setShow(false);
  const handleShowEnterPrice = () => {
    setShowEnterPrice(true);
  };
  const handlePriceActionChange = (event) => {
    setPriceAction(event.target.value);
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleMinValueChange = (event) => {
    setMinValue(event.target.value);
  };
  const handleMaxValueChange = (event) => {
    setMaxValue(event.target.value);
  };
  const openModalOffset = () => {
    setShowModalOffset(true);
  };
  const closeModalOffset = () => {
    setShowModalOffset(false);
  };
  const closeModalAndOrOperator = () => {
    setShowModalAndOrOperator(false);
  };
  const openModalAndOrOperator = () => {
    setShowModalAndOrOperator(true);
  };
  const ChangeOffset = (e) => {
    setOffSetValue(e.target.value);
  };

  useEffect(() => {
    if (filterServices) {
      handleShow();
    }
  }, [filterServices]);

  useEffect(() => {
    getAllSteategyApi();
    getAllTimeFrameApi();
    getAllSourceApi();
    getAllComparatorsApi();
  }, []);

  const handleShow = async () => {
    setShow(true);

    const config = {
      method: "post",
      url: `${Config.base_url}add/getservicename`,
      data: {
        searchQuery: filterServices,
      },
    };

    axios(config)
      .then(function (response) {
        setStoreServiceData(response.data.data);
      })
      .catch(function (error) {
        return;
      });
  };

  const handleAddItem = (item) => {
    const isItemAlreadySelected = selectedItems.some(
      (selectedItem) => selectedItem.tradesymbol === item.tradesymbol
    );
    if (!isItemAlreadySelected) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedItems = selectedItems.filter((item) => item !== itemToRemove);
    setSelectedItems(updatedItems);
  };

  const indicatorAddItem = (item) => {
    const isItemAlreadySelected = selectAddIndicators.some(
      (selectedItem) => selectedItem.name === item.name
    );
    if (!isItemAlreadySelected) {
      setSelectAddIndicators([...selectAddIndicators, item]);
    }
  };

  const indicatorRemoveItem = (itemToRemove) => {
    const updatedItems = selectAddIndicators.filter(
      (item) => item !== itemToRemove
    );
    setSelectAddIndicators(updatedItems);
  };

  const getAllTimeFrameApi = async () => {
    await dispatch(
      get_time_frame({
        req: {
          page: "1",
          limit: "100",
        },
        token: AdminToken,
      })
    )
      .unwrap()
      .then((response) => {
        if (response) {
          if (response.status) {
            setTimeFrameData({
              loading: false,
              data: response.data,
            });
          } else {
            setTimeFrameData({
              loading: false,
              data: response.data,
            });
          }
        }
      });
  };

  const getAllSourceApi = async () => {
    await dispatch(
      get_source({
        req: {
          page: "1",
          limit: "100",
        },
        token: AdminToken,
      })
    )
      .unwrap()
      .then((response) => {
        if (response) {
          if (response.status) {
            setGetSources({
              loading: false,
              data: response.data,
            });
          } else {
            setGetSources({
              loading: false,
              data: response.data,
            });
          }
        }
      });
  };

  const getAllComparatorsApi = async () => {
    await dispatch(
      get_comparators({
        req: {
          page: "1",
          limit: "100",
        },
        token: AdminToken,
      })
    )
      .unwrap()
      .then((response) => {
        if (response) {
          if (response.status) {
            setGetComparators({
              loading: false,
              data: response.data,
            });
          } else {
            setGetComparators({
              loading: false,
              data: response.data,
            });
          }
        }
      });
  };

  const getAllSteategyApi = async () => {
    await dispatch(
      Get_All_Strategy({
        req: {
          page: "1",
          limit: "100",
        },
        token: AdminToken,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (response.status) {
            setStrategyDataAllAdmin({
              loading: false,
              data: response.data,
            });
          } else {
            setStrategyDataAllAdmin({
              loading: false,
              data: response.data,
            });
          }
        }
      });
  };

  const onChange = (e) => {
    if (e.target.name == "strategy_name") {
      if (e.target.value != "") {
        setStrategyName(e.target.value);
      } else {
        setStrategyName("");
      }
    } else if (e.target.name == "no_of_trade") {
      const type = No_Negetive_Input_regex(e.target.value);
      if (type) {
        if (e.target.value != "") {
          setNumberOfTrade(e.target.value);
        } else {
          setNumberOfTrade("");
        }
      } else {
        if (e.target.value == "") {
          setNumberOfTrade("");
        } else {
          setNumberOfTrade("1");
        }
      }
    } else if (e.target.name == "max_profit") {
      const type = No_Negetive_Input_regex(e.target.value);
      if (type) {
        if (e.target.value != "") {
          setMaxProfit(e.target.value);
        } else {
          setMaxProfit("");
        }
      } else {
        if (e.target.value == "") {
          setMaxProfit("");
        } else {
          setMaxProfit("1");
        }
      }
    } else if (e.target.name == "max_loss") {
      const type = No_Negetive_Input_regex(e.target.value);
      if (type) {
        if (e.target.value != "") {
          setMaxLoss(e.target.value);
        } else {
          setMaxLoss("");
        }
      } else {
        if (e.target.value == "") {
          setMaxLoss("");
        } else {
          setMaxLoss("1");
        }
      }
    }
  };

  const selectSource = (
    e,
    condition_item,
    element_first_second,
    index,
    buy_sell
  ) => {
    if (e.target.value != "") {
      if (buy_sell == "buy") {
        const foundObject = coditionRequestArr.find((item, i) => i === index);
        if (foundObject) {
          // Update the source field of the found object
          if (element_first_second == "first") {
            foundObject.first_element.source = e.target.value;
          } else if (element_first_second == "second") {
            foundObject.second_element.source = e.target.value;
          }
          // Create a new array to trigger a state update
          setCoditionRequestArr([...coditionRequestArr]);
        }
      } else if (buy_sell == "sell") {
        const foundObject = coditionRequestArrSell.find(
          (item, i) => i === index
        );
        if (foundObject) {
          // Update the source field of the found object
          if (element_first_second == "first") {
            foundObject.first_element.source = e.target.value;
          } else if (element_first_second == "second") {
            foundObject.second_element.source = e.target.value;
          }
          // Create a new array to trigger a state update
          setCoditionRequestArrSell([...coditionRequestArrSell]);
        }
      }
    }
  };

  const ChangeOffsetval = (
    e,
    condition_item,
    element_first_second,
    index,
    buy_sell
  ) => {
    if (e.target.value != "") {
      if (buy_sell == "buy") {
        const foundObject = coditionRequestArr.find((item, i) => i === index);

        if (foundObject) {
          if (element_first_second == "first") {
            foundObject.first_element.offset = e.target.value;
          } else if (element_first_second == "second") {
            foundObject.second_element.offset = e.target.value;
          }
          // Create a new array to trigger a state update
          setCoditionRequestArr([...coditionRequestArr]);
        }
      } else if (buy_sell == "sell") {
        const foundObject = coditionRequestArrSell.find(
          (item, i) => i === index
        );

        if (foundObject) {
          if (element_first_second == "first") {
            foundObject.first_element.offset = e.target.value;
          } else if (element_first_second == "second") {
            foundObject.second_element.offset = e.target.value;
          }
          // Create a new array to trigger a state update
          setCoditionRequestArrSell([...coditionRequestArrSell]);
        }
      }
    }
  };

  const selectComparators = (e, condition_item, index, buy_sell) => {
    if (buy_sell == "buy") {
      const foundObject = coditionRequestArr.find((item, i) => i === index);
      if (foundObject) {
        foundObject.comparators = e.target.value;
        setCoditionRequestArr([...coditionRequestArr]);
      }
    } else if (buy_sell == "sell") {
      const foundObject = coditionRequestArrSell.find((item, i) => i === index);
      if (foundObject) {
        foundObject.comparators = e.target.value;
        setCoditionRequestArrSell([...coditionRequestArrSell]);
      }
    }
  };

  const conditionRemove = (index, buy_sell) => {
    if (buy_sell == "buy") {
      setCoditionRequestArr((oldValues) => {
        return oldValues.filter((item, i) => i !== index);
      });
    } else if (buy_sell == "sell") {
      setCoditionRequestArrSell((oldValues) => {
        return oldValues.filter((item, i) => i !== index);
      });
    }
  };

  const conditionAdd = (ArrCondition, buy_sell) => {
    if (buy_sell == "buy") {
      if (coditionRequestArr.length == 0) {
        let pre_tag = {
          start_bracket: [],
          first_element: {
            source: "",
            offset: "0",
          },

          comparators: "==",

          second_element: {
            source: "",
            offset: "0",
          },
          and_or_operator: "",
          end_bracket: [],
        };

        setCoditionRequestArr((oldArray) => [...oldArray, pre_tag]);
      } else {
        const lastIndex = ArrCondition.length - 1;

        const foundObject = coditionRequestArr.find(
          (item, i) => i === lastIndex
        );
        if (foundObject) {
          // Update the source field of the found object

          if (
            foundObject.first_element.source == "" &&
            foundObject.second_element.source == ""
          ) {
            alert("please select first and second element");
          } else {
            setCheckBuySellAndOr("buy");
            openModalAndOrOperator();
          }
        }
      }
    } else if (buy_sell == "sell") {
      if (coditionRequestArrSell.length == 0) {
        let pre_tag = {
          start_bracket: [],
          first_element: {
            source: "",
            offset: "0",
          },

          comparators: "==",

          second_element: {
            source: "",
            offset: "0",
          },
          and_or_operator: "",
          end_bracket: [],
        };

        setCoditionRequestArrSell((oldArray) => [...oldArray, pre_tag]);
      } else {
        const lastIndex = ArrCondition.length - 1;

        const foundObject = coditionRequestArrSell.find(
          (item, i) => i === lastIndex
        );
        if (foundObject) {
          // Update the source field of the found object

          if (
            foundObject.first_element.source == "" &&
            foundObject.second_element.source == ""
          ) {
            alert("please select first and second element");
          } else {
            setCheckBuySellAndOr("sell");
            openModalAndOrOperator();
          }
        }
      }
    }
  };

  const ModalConfirmAndOrOperator = (buy_sell) => {
    if (buy_sell == "buy") {
      const lastIndex = coditionRequestArr.length - 1;
      const foundObject = coditionRequestArr.find((item, i) => i === lastIndex);
      if (foundObject) {
        // Update the source field of the found object
        foundObject.and_or_operator = selectAndOrOperater;
        // Create a new array to trigger a state update
        setCoditionRequestArr([...coditionRequestArr]);
      }

      let pre_tag = {
        start_bracket: [],
        first_element: {
          source: "",
          offset: "0",
        },

        comparators: "==",

        second_element: {
          source: "",
          offset: "0",
        },
        and_or_operator: "",
        end_bracket: [],
        //and_or_operator:selectAndOrOperater,
      };
      setCoditionRequestArr((oldArray) => [...oldArray, pre_tag]);
      closeModalAndOrOperator();
    } else if (buy_sell == "sell") {
      const lastIndex = coditionRequestArrSell.length - 1;
      const foundObject = coditionRequestArrSell.find(
        (item, i) => i === lastIndex
      );
      if (foundObject) {
        // Update the source field of the found object
        foundObject.and_or_operator = selectAndOrOperater;
        // Create a new array to trigger a state update
        setCoditionRequestArrSell([...coditionRequestArrSell]);
      }

      let pre_tag = {
        start_bracket: [],
        first_element: {
          source: "",
          offset: "0",
        },

        comparators: "==",

        second_element: {
          source: "",
          offset: "0",
        },
        and_or_operator: "",
        end_bracket: [],
        //and_or_operator:selectAndOrOperater,
      };
      setCoditionRequestArrSell((oldArray) => [...oldArray, pre_tag]);
      closeModalAndOrOperator();
    }
  };

  const ModalConfirmOffset = (
    selectConditionItem,
    selectedElementFirsSecond,
    index,
    source,
    buy_sell
  ) => {
    if (buy_sell == "buy") {
      const foundObject = coditionRequestArr.find((item, i) => i === index);
      if (foundObject) {
        // Update the source field of the found object
        if (selectedElementFirsSecond == "first") {
          foundObject.first_element.source = source;
          foundObject.first_element.offset = offSetValue;
        } else if (selectedElementFirsSecond == "second") {
          foundObject.second_element.source = source;
          foundObject.second_element.offset = offSetValue;
        }
        // Create a new array to trigger a state update
        setCoditionRequestArr([...coditionRequestArr]);
      }
      setOffSetValue(0);
      closeModalOffset();
    } else if (buy_sell == "sell") {
      const foundObject = coditionRequestArrSell.find((item, i) => i === index);
      if (foundObject) {
        // Update the source field of the found object
        if (selectedElementFirsSecond == "first") {
          foundObject.first_element.source = source;
          foundObject.first_element.offset = offSetValue;
        } else if (selectedElementFirsSecond == "second") {
          foundObject.second_element.source = source;
          foundObject.second_element.offset = offSetValue;
        }
        // Create a new array to trigger a state update
        setCoditionRequestArrSell([...coditionRequestArrSell]);
      }
      setOffSetValue(0);
      closeModalOffset();
    }
  };

  const selectAndOrOperaterChange = (e, condition_item, index, buy_sell) => {
    if (buy_sell == "buy") {
      const foundObject = coditionRequestArr.find((item, i) => i === index);
      if (foundObject) {
        foundObject.and_or_operator = e.target.value;
        setCoditionRequestArr([...coditionRequestArr]);
      }
    } else if (buy_sell == "sell") {
      const foundObject = coditionRequestArrSell.find((item, i) => i === index);
      if (foundObject) {
        foundObject.and_or_operator = e.target.value;
        setCoditionRequestArrSell([...coditionRequestArrSell]);
      }
    }
  };

  // ===================================START================================================

  let condition_string = "";
  let condition_string_pass = "";
  let condition_string_sell = "";
  let condition_string_sell_pass = "";

  for (let index = 0; index < coditionRequestArr.length; index++) {
    const val = coditionRequestArr[index];

    if (val.first_element.source !== "" && val.second_element.source !== "") {
      let and_or = "";
      let and_or_pass = "";
      if (val.and_or_operator == "or") {
        and_or = "OR";
        and_or_pass = "||";
      } else if (val.and_or_operator == "and") {
        and_or = "AND";
        and_or_pass = "&&";
      }

      if (coditionRequestArr.length == 1) {
        and_or = "";
      }

      let start_bracket = "";
      if (val.start_bracket.length > 0) {
        start_bracket = val.start_bracket.join("");
      }

      let end_bracket = "";
      if (val.end_bracket.length > 0) {
        end_bracket = val.end_bracket.join("");
      }

      // condition_string += `${start_bracket}(${val.first_element.source}[${val.first_element.offset}] ${val.comparators} ${val.second_element.source}[${val.second_element.offset}])${end_bracket}  ${and_or}  `;

      let first_element = `${val.first_element.source}[${val.first_element.offset}]`;
      if (val.first_element.source == "number") {
        first_element = val.first_element.offset;
      }

      let second_element = `${val.second_element.source}[${val.second_element.offset}]`;
      if (val.second_element.source == "number") {
        second_element = val.second_element.offset;
      }

      condition_string += `${start_bracket}(${first_element} ${val.comparators} ${second_element})${end_bracket}  ${and_or}  `;

      let first_element_pass = `data.${val.first_element.source}[${val.first_element.offset}]`;
      if (val.first_element.source == "number") {
        first_element_pass = val.first_element.offset;
      }

      let second_element_pass = `data.${val.second_element.source}[${val.second_element.offset}]`;
      if (val.second_element.source == "number") {
        second_element_pass = val.second_element.offset;
      }

      condition_string_pass += `${start_bracket}(${first_element_pass}${val.comparators}${second_element_pass})${end_bracket}${and_or_pass}`;
    } else {
      break; // Break out of the loop
    }
  }

  for (let index = 0; index < coditionRequestArrSell.length; index++) {
    const val = coditionRequestArrSell[index];

    if (val.first_element.source !== "" && val.second_element.source !== "") {
      let and_or = "";
      let and_or_pass = "";
      if (val.and_or_operator == "or") {
        and_or = "OR";
        and_or_pass = "||";
      } else if (val.and_or_operator == "and") {
        and_or = "AND";
        and_or_pass = "&&";
      }

      if (coditionRequestArrSell.length == 1) {
        and_or = "";
      }

      let start_bracket = "";
      if (val.start_bracket.length > 0) {
        start_bracket = val.start_bracket.join("");
      }

      let end_bracket = "";
      if (val.end_bracket.length > 0) {
        end_bracket = val.end_bracket.join("");
      }

      // condition_string_sell += `${start_bracket}(${val.first_element.source}[${val.first_element.offset}] ${val.comparators} ${val.second_element.source}[${val.second_element.offset}])${end_bracket}  ${and_or}  `;

      // condition_string_sell_pass += `${start_bracket}(data.${val.first_element.source}[${val.first_element.offset}]${val.comparators}data.${val.second_element.source}[${val.second_element.offset}])${end_bracket}${and_or_pass}`;

      let first_element = `${val.first_element.source}[${val.first_element.offset}]`;
      if (val.first_element.source == "number") {
        first_element = val.first_element.offset;
      }

      let second_element = `${val.second_element.source}[${val.second_element.offset}]`;
      if (val.second_element.source == "number") {
        second_element = val.second_element.offset;
      }

      condition_string_sell += `${start_bracket}(${first_element} ${val.comparators} ${second_element})${end_bracket}  ${and_or}  `;

      let first_element_pass = `data.${val.first_element.source}[${val.first_element.offset}]`;
      if (val.first_element.source == "number") {
        first_element_pass = val.first_element.offset;
      }

      let second_element_pass = `data.${val.second_element.source}[${val.second_element.offset}]`;
      if (val.second_element.source == "number") {
        second_element_pass = val.second_element.offset;
      }

      condition_string_sell_pass += `${start_bracket}(${first_element_pass}${val.comparators}${second_element_pass})${end_bracket}${and_or_pass}`;
    } else {
      break; // Break out of the loop
    }
  }

  // ======================================END=============================================

  const AddBracket = (index, start_and, buy_sell) => {
    if (buy_sell == "buy") {
      if (start_and == "start") {
        const foundObject = coditionRequestArr.find((item, i) => i === index);

        if (foundObject) {
          // Update the source field of the found object
          foundObject.start_bracket.push("(");
          // Create a new array to trigger a state update
          setCoditionRequestArr([...coditionRequestArr]);
        }
      } else if (start_and == "end") {
        const foundObject = coditionRequestArr.find((item, i) => i === index);

        if (foundObject) {
          // Update the source field of the found object
          foundObject.end_bracket.push(")");
          // Create a new array to trigger a state update
          setCoditionRequestArr([...coditionRequestArr]);
        }
      }
    } else if (buy_sell == "sell") {
      if (start_and == "start") {
        const foundObject = coditionRequestArrSell.find(
          (item, i) => i === index
        );

        if (foundObject) {
          // Update the source field of the found object
          foundObject.start_bracket.push("(");
          // Create a new array to trigger a state update
          setCoditionRequestArrSell([...coditionRequestArrSell]);
        }
      } else if (start_and == "end") {
        const foundObject = coditionRequestArrSell.find(
          (item, i) => i === index
        );

        if (foundObject) {
          // Update the source field of the found object
          foundObject.end_bracket.push(")");
          // Create a new array to trigger a state update
          setCoditionRequestArrSell([...coditionRequestArrSell]);
        }
      }
    }
  };

  const RemoveBracket = (index, start_and, last_index, buy_sell) => {
    if (buy_sell == "buy") {
      if (last_index > -1) {
        if (start_and == "start") {
          const foundObject = coditionRequestArr.find((item, i) => i === index);

          if (foundObject) {
            // Update the source field of the found object
            foundObject.start_bracket.pop();
            // Create a new array to trigger a state update
            setCoditionRequestArr([...coditionRequestArr]);
          }
        } else if (start_and == "end") {
          const foundObject = coditionRequestArr.find((item, i) => i === index);

          if (foundObject) {
            // Update the source field of the found object
            foundObject.end_bracket.pop();
            // Create a new array to trigger a state update
            setCoditionRequestArr([...coditionRequestArr]);
          }
        }
      }
    } else if (buy_sell == "sell") {
      if (last_index > -1) {
        if (start_and == "start") {
          const foundObject = coditionRequestArrSell.find(
            (item, i) => i === index
          );

          if (foundObject) {
            // Update the source field of the found object
            foundObject.start_bracket.pop();
            // Create a new array to trigger a state update
            setCoditionRequestArrSell([...coditionRequestArrSell]);
          }
        } else if (start_and == "end") {
          const foundObject = coditionRequestArrSell.find(
            (item, i) => i === index
          );

          if (foundObject) {
            // Update the source field of the found object
            foundObject.end_bracket.pop();
            // Create a new array to trigger a state update
            setCoditionRequestArrSell([...coditionRequestArrSell]);
          }
        }
      }
    }
  };

  const StoplossChange = (e, buy_sell) => {
    if (parseInt(e.target.value) > 0) {
      if (buy_sell == "buy") {
        const foundObjectexit = exitConditionBuyOrSell.find(
          (item, i) => i === 0
        );
        if (foundObjectexit) {
          foundObjectexit.buy.stoploss = e.target.value;
          setExitConditionBuyOrSell([...exitConditionBuyOrSell]);
        }
      } else if (buy_sell == "sell") {
        const foundObjectexit = exitConditionBuyOrSell.find(
          (item, i) => i === 0
        );
        if (foundObjectexit) {
          foundObjectexit.sell.stoploss = e.target.value;
          setExitConditionBuyOrSell([...exitConditionBuyOrSell]);
        }
      }
    }
  };

  const TargetChange = (e, buy_sell) => {
    if (buy_sell == "buy") {
      const foundObjectexit = exitConditionBuyOrSell.find((item, i) => i === 0);
      if (foundObjectexit) {
        foundObjectexit.buy.target = e.target.value;
        setExitConditionBuyOrSell([...exitConditionBuyOrSell]);
      }
    } else if (buy_sell == "sell") {
      const foundObjectexit = exitConditionBuyOrSell.find((item, i) => i === 0);
      if (foundObjectexit) {
        foundObjectexit.sell.target = e.target.value;
        setExitConditionBuyOrSell([...exitConditionBuyOrSell]);
      }
    }
  };

  const TSLChange = (e, buy_sell) => {
    if (buy_sell == "buy") {
      const foundObjectexit = exitConditionBuyOrSell.find((item, i) => i === 0);
      if (foundObjectexit) {
        foundObjectexit.buy.tsl = e.target.value;
        setExitConditionBuyOrSell([...exitConditionBuyOrSell]);
      }
    } else if (buy_sell == "sell") {
      const foundObjectexit = exitConditionBuyOrSell.find((item, i) => i === 0);
      if (foundObjectexit) {
        foundObjectexit.sell.tsl = e.target.value;
        setExitConditionBuyOrSell([...exitConditionBuyOrSell]);
      }
    }
  };

  const selectTime = (e, type) => {
    //  alert(e.target.value)
    if (e.target.value != "") {
      if (type == "entry") {
        const foundObjectTime = timeTradeConddition.find((item, i) => i === 0);
        if (foundObjectTime) {
          foundObjectTime.entry.time = e.target.value;
          setTimeTradeConddition([...timeTradeConddition]);
        }
      } else if (type == "exit") {
        const foundObjectTime = timeTradeConddition.find((item, i) => i === 0);
        if (foundObjectTime) {
          foundObjectTime.exit.time = e.target.value;
          setTimeTradeConddition([...timeTradeConddition]);
        }
      } else if (type == "notrade") {
        const foundObjectTime = timeTradeConddition.find((item, i) => i === 0);
        if (foundObjectTime) {
          foundObjectTime.notrade.time = e.target.value;
          setTimeTradeConddition([...timeTradeConddition]);
        }
      }
    }
  };

  function areParenthesesBalanced(expression) {
    const stack = [];
    for (let char of expression) {
      if (char === "(") {
        stack.push(char);
      } else if (char === ")") {
        if (stack.length === 0 || stack.pop() !== "(") {
          return false; // Unbalanced parentheses
        }
      }
    }
    return stack.length === 0; // True if parentheses are balanced
  }

  const saveStrategy = async (e) => {
    // alert(condition_string)

    if (strategyName == "") {
      alert("Please select a strategy name");
      return;
    }

    if (selectStrategy == "") {
      alert("Please select a strategy tag");
      return;
    }

    if (selectedItems.length == 0) {
      alert("Please select a Instruments");
      return;
    }

    if (!buyCheck && !sellCheck) {
      alert("Please select a Buy or Sell");
      return;
    }

    if (condition_string == "" && condition_string_sell == "") {
      alert("Please select a add condition");
      return;
    }

    let buy_cond = false;
    if (condition_string != "") {
      buy_cond = areParenthesesBalanced(condition_string);
      if (!buy_cond) {
        alert("Please correct Buy condition");
        return;
      }
    }

    let sell_cond = false;
    if (condition_string_sell != "") {
      sell_cond = areParenthesesBalanced(condition_string_sell);
      if (!sell_cond) {
        alert("Please correct Sell condition");
        return;
      }
    }

    if (sellCheck) {
      if (!sell_cond) {
        alert("Please add Sell condition");
        return;
      }
    }

    if (buyCheck) {
      if (!buy_cond) {
        alert("Please add Buy condition");
        return;
      }
    }

    setDisableSaveButtun(true);

    let condition_string_source = [];
    for (let index = 0; index < coditionRequestArr.length; index++) {
      const val = coditionRequestArr[index];

      if (val.first_element.source !== "" && val.second_element.source !== "") {
        if (val.first_element.source != "number") {
          if (
            !condition_string_source.includes(
              `${val.first_element.source}(${val.first_element.offset})`
            )
          ) {
            condition_string_source.push(
              `${val.first_element.source}(${val.first_element.offset})`
            );
          }
        }

        if (val.second_element.source != "number") {
          if (
            !condition_string_source.includes(
              `${val.second_element.source}(${val.second_element.offset})`
            )
          ) {
            condition_string_source.push(
              `${val.second_element.source}(${val.second_element.offset})`
            );
          }
        }
      } else {
        break; // Break out of the loop
      }
    }

    let condition_string_sell_source = [];
    for (let index = 0; index < coditionRequestArrSell.length; index++) {
      const val = coditionRequestArrSell[index];
      if (val.first_element.source !== "" && val.second_element.source !== "") {
        if (val.first_element.source != "number") {
          if (
            !condition_string_sell_source.includes(
              `${val.first_element.source}(${val.first_element.offset})`
            )
          ) {
            condition_string_sell_source.push(
              `${val.first_element.source}(${val.first_element.offset})`
            );
          }
        }

        if (val.second_element.source != "number") {
          if (
            !condition_string_sell_source.includes(
              `${val.second_element.source}(${val.second_element.offset})`
            )
          ) {
            condition_string_sell_source.push(
              `${val.second_element.source}(${val.second_element.offset})`
            );
          }
        }
      } else {
        break; // Break out of the loop
      }
    }

    // Send Request Buy ------
    if (buyCheck && buy_cond) {
      // alert("buy")

      let data = {
        scriptArray: selectedItems,
        name: strategyName,
        user_id: user_Id,

        strategy_name: selectStrategy,

        timeframe: timeFrameVal,
        type: "BUY",
        indicator: "MA",
        price_source: "open",
        period: "1",
        inside_indicator: "EMA",

        condition: condition_string_pass.replace(/(\|\||&&)$/, ""),

        condition_source: condition_string_source,
        buffer_value: "2",
        offset: "0",
        target_stoploss: exitConditionBuyOrSell[0].buy,
        timeTradeConddition: timeTradeConddition,
        condition_array: coditionRequestArr,
        target_stoloss_array: exitConditionBuyOrSell,
        numberOfTrade: numberOfTrade,
        maxProfit: maxProfit,
        maxLoss: maxLoss,
      };

      await dispatch(Add_Make_Strategy({ req: data, token: AdminToken }))
        .unwrap()
        .then((response) => {
          if (response.status === 409) {
            toast.error(response.data.msg);
          } else if (response.status) {
            if (!sellCheck && !sell_cond) {
              toast.success(response.msg);

              setTimeout(() => {
                if (user_role === "ADMIN") {
                  navigate("/admin/AllMakeStrategy");
                } else if (user_role === "SUBADMIN") {
                  navigate("/subadmin/AllMakeStrategy");
                }
              }, 1000);
            } else {
            }
          } else if (!response.status) {
            toast.error(response.msg);
          }
        });
    }

    // Send Request Sell ------
    if (sellCheck && sell_cond) {
      //  alert("sell")
      let data = {
        scriptArray: selectedItems,
        name: strategyName,
        user_id: user_Id,

        strategy_name: selectStrategy,

        timeframe: timeFrameVal,
        type: "SELL",
        indicator: "MA",
        price_source: "open",
        period: "1",
        inside_indicator: "EMA",

        condition: condition_string_sell_pass.replace(/(\|\||&&)$/, ""),

        condition_source: condition_string_sell_source,
        buffer_value: "2",
        offset: "0",
        target_stoploss: exitConditionBuyOrSell[0].sell,
        timeTradeConddition: timeTradeConddition,
        condition_array: coditionRequestArrSell,
        target_stoloss_array: exitConditionBuyOrSell,
        numberOfTrade: numberOfTrade,
        maxProfit: maxProfit,
        maxLoss: maxLoss,
      };

      await dispatch(Add_Make_Strategy({ req: data, token: AdminToken }))
        .unwrap()
        .then((response) => {
          if (response.status === 409) {
            toast.error(response.data.msg);
          } else if (response.status) {
            toast.success(response.msg);
            //window.location.reload();
            setTimeout(() => {
              if (user_role === "ADMIN") {
                navigate("/admin/AllMakeStrategy");
              } else if (user_role === "SUBADMIN") {
                navigate("/subadmin/AllMakeStrategy");
              }
            }, 1000);
          } else if (!response.status) {
            toast.error(response.msg);
          }
        });
    }
  };

  return (
    <>
      <>
        <Content
          Page_title="Create Strategy"
          button_title="Back"
          route={
            user_role === "ADMIN"
              ? "/admin/AllMakeStrategy"
              : user_role === "SUBADMIN"
                ? "/subadmin/AllMakeStrategy"
                : ""
          }
        >
          <div>
            <div className="col-md-2 ">
              <label
                className=" ps-5"
                style={{ fontWeight: "bold", color: "black", fontSize: "15px" }}
              >
                Strategy Name
              </label>
              <input
                type="text"
                onChange={(e) => {
                  onChange(e);
                }}
                name="strategy_name"
                className="form-control stratergy-box"
              ></input>
            </div>

            <div className="col-md-2 ">
              <label
                className=" ps-5"
                style={{ fontWeight: "bold", color: "black", fontSize: "15px" }}
              >
                Strategy Tag
              </label>
              <select
                className="form-select stratergy-box"
                onChange={(e) => setSelectStrategy(e.target.value)}
                name="strategyname"
              >
                <option value="">-- Select Strategy Tag--</option>
                {strategyDataAllAdmin.data &&
                  strategyDataAllAdmin.data.map((sm, i) => (
                    <option value={sm.strategy_name}>{sm.strategy_name}</option>
                  ))}
              </select>
            </div>

            <div className="col-md-2 ">
              <label
                className=" ps-5"
                style={{ fontWeight: "bold", color: "black", fontSize: "15px" }}
              >
                Number of Trade
              </label>
              <input
                min={1}
                type="text"
                onChange={(e) => {
                  onChange(e);
                }}
                name="no_of_trade"
                className="form-control stratergy-box"
                value={numberOfTrade}
              ></input>
            </div>

            <Modal show={show} onHide={handleClose} className="right">
              <Modal.Header>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search Stocks eg, SBIN"
                  value={filterServices}
                  onChange={(e) => setFilterServices(e.target.value)}
                />
              </Modal.Header>
              <Modal.Body>
                <ul className="ps-0">
                  {storeServiceData && Array.isArray(storeServiceData) ? (
                    storeServiceData.map((x) => (
                      <li className="my-2" key={x.id}>
                        <div className="row">
                          <div className="col-md-2">
                            <img
                              className="w-100 p-2"
                              src="https://upload.wikimedia.org/wikipedia/en/6/60/ACFTU_logo.png"
                              alt="Logo"
                            />
                          </div>
                          <div className="col-md-7 ps-0">
                            <h3 className="mb-0">{x.tradesymbol}</h3>
                            <p className="text-muted my-0">{x.exch_seg}</p>
                          </div>
                          <div className="col-md-3 d-flex list-btn">
                            <button className="btn border-0">
                              <i
                                className="fa-regular fa-square-plus"
                                onClick={() => handleAddItem(x)}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>No data available</li>
                  )}
                </ul>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>

            <ul className="StepProgress">
              <li className="StepProgress-item is-done">
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

                  {selectedItems &&
                    selectedItems.map((x) => (
                      <div className="col-md-2">
                        <div className="card card-strategy">
                          <div className="card-body">
                            <h4>
                              <span>
                                <img src="https://seeklogo.com/images/I/indraprastha-gas-logo-8CD9114819-seeklogo.com.png"></img>
                              </span>
                              {x.tradesymbol}
                            </h4>
                            <p className="text-muted my-0">{x.exch_seg}</p>
                            <div className="d-flex justify-content-between my-1">
                              {/* <i className="fa-solid fa-pen-to-square"></i> */}
                              <i
                                className="fa-solid fa-trash-can"
                                onClick={() => handleRemoveItem(x)}
                              ></i>
                            </div>
                            {/* <h3 className="text-success my-0 ">45.5</h3>
                          <p className="text-success my-0">%45.5</p> */}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </li>
              <li className="StepProgress-item is-done">
                <div className="row">
                  <div className="col-xl-6">
                    <div className="card">
                      <div className="">
                        <label>Candle Interval</label>
                      </div>
                      <div className="card-body px-0 pt-0">
                        <ul className="nav nav-pills justify-content-between mb-4">
                          {timeFrameData.data &&
                            timeFrameData.data.map((item, index) => (
                              <li className=" nav-item">
                                <a
                                  href="#navpills2-1"
                                  className={`nav-link ${timeFrameVal === item.value ? "active" : ""
                                    }`}
                                  data-bs-toggle="tab"
                                  aria-expanded="false"
                                  onClick={() => selectTimeFrame(item)}
                                >
                                  {item.name}
                                </a>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <Row className="mt-4">
                <Col md={2}>
                  <h5
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "15px",
                    }}
                  >
                    Entry Time
                  </h5>
                </Col>
                <Col md={2}>
                  {/* <label>Time</label> */}
                  <Form.Control
                    style={{ height: "auto" }}
                    type="time"
                    id="text3"
                    value={timeTradeConddition[0].entry.time}
                    onChange={(e) => {
                      selectTime(e, "entry");
                    }}
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                <Col md={2}>
                  <h5
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "15px",
                    }}
                  >
                    Exit Time
                  </h5>
                </Col>

                <Col md={2}>
                  {/* <label>Time</label> */}
                  <Form.Control
                    style={{ height: "auto" }}
                    type="time"
                    id="text3"
                    value={timeTradeConddition[0].exit.time}
                    onChange={(e) => {
                      selectTime(e, "exit");
                    }}
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                <Col md={2}>
                  <h5
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "15px",
                    }}
                  >
                    No Trade Time
                  </h5>
                </Col>

                <Col md={2}>
                  {/* <label>Time</label> */}
                  <Form.Control
                    style={{ height: "auto" }}
                    type="time"
                    id="text3"
                    value={timeTradeConddition[0].notrade.time}
                    onChange={(e) => {
                      selectTime(e, "notrade");
                    }}
                  />
                </Col>
              </Row>

              <li
                className="StepProgress-item current is-done"
                style={{ marginTop: "50px" }}
              >
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    onChange={(e) => setBuyCheck(e.target.checked)}
                    type="checkbox"
                    id="inlineCheckbox1"
                    value="option1"
                  />
                  <label className="form-check-label" htmlFor="inlineCheckbox1">
                    Buy
                  </label>
                </div>

                <strong>Buy Entry Condition</strong>

                {buyCheck == true ? (
                  <>
                    <h4>{condition_string}</h4>
                    <div className="table-responsive w-100">
                      <table className="table">
                        <thead className="bg-transparent">
                          <tr>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>Bracket</th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>First</th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>Comparators</th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>Second</th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>Bracket</th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}></th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>Remove</th>
                          </tr>
                        </thead>
                        <tbody>

                          {coditionRequestArr && coditionRequestArr.map((condition_item, index) => {
                            return (
                              <>
                                <tr key={index}>
                                  <td >
                                    <button
                                      className="btn btn-success" style={{ fontSize: '15px', padding: '2px 5px' }}
                                      onClick={() =>
                                        AddBracket(index, "start", "buy")
                                      }
                                    >
                                      {/* + Bracket */}
                                      <i className="fa-solid fa-circle-plus"></i>
                                    </button>


                                    {condition_item.start_bracket.length > 0 ? (
                                      <button
                                        className="btn btn-danger mx-1" style={{ fontSize: '10px', padding: '2px 3px' }}
                                        onClick={() =>
                                          RemoveBracket(
                                            index,
                                            "start",
                                            condition_item.start_bracket.length - 1,
                                            "buy"
                                          )
                                        }
                                      >
                                        <i className="fa-solid fa-xmark"></i>
                                      </button>
                                    ) : (
                                      ""
                                    )}

                                    <p
                                      style={{
                                        marginRight: "10px",
                                        fontSize: "larger",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {condition_item.start_bracket.join("")}
                                    </p>
                                  </td>


                                  <td>
                                    <div className="d-flex">
                                      <select className="form-select" name="first_source"
                                        onChange={(e) => {
                                          selectSource(e, condition_item, "first", index, "buy");
                                        }}
                                      >
                                        <option value="">---</option>
                                        {getSources.data.map((sm, i) => (
                                          <option
                                            selected={
                                              condition_item.first_element.source ==
                                              sm.value
                                            }
                                            value={sm.value}
                                          >
                                            {sm.name}
                                          </option>
                                        ))}
                                      </select>

                                      <input
                                        type="number"
                                        defaultValue={
                                          condition_item.first_element.offset
                                        }
                                        onChange={(e) => {
                                          ChangeOffsetval(e, condition_item, "first", index, "buy");
                                        }}
                                        min="0"
                                        className="form-control w-50 ms-2"
                                      />
                                    </div>
                                  </td>

                                  <td>

                                    <select
                                      className="form-select" name="comparators"
                                      onChange={(e) => {
                                        selectComparators(e, condition_item, index, "buy");
                                      }}
                                    >
                                      {/* <option value="">---</option> */}
                                      {getComparators.data.map((sm, i) => (
                                        <option
                                          selected={
                                            condition_item.comparators == sm.value
                                          }
                                          value={sm.value}
                                        >
                                          {sm.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>



                                  <td>
                                    <div className="d-flex">

                                      <select className="form-select" name="second_source"
                                        onChange={(e) => {
                                          selectSource(e, condition_item, "second", index,
                                            "buy");
                                        }}
                                      >

                                        <option value="">---</option>
                                        {getSources.data.map((sm, i) => (
                                          <option
                                            selected={
                                              condition_item.second_element.source ==
                                              sm.value
                                            }
                                            value={sm.value}
                                          >
                                            {sm.name}
                                          </option>
                                        ))}
                                      </select>
                                      <input
                                        type="number"
                                        defaultValue={
                                          condition_item.second_element.offset
                                        }
                                        onChange={(e) => {
                                          ChangeOffsetval(e, condition_item, "second", index,
                                            "buy");
                                        }}
                                        min="0"
                                        className="form-control w-50 ms-2"
                                      />
                                    </div>
                                  </td>

                                  <td>

                                    {condition_item.end_bracket.length > 0 ? (
                                      <button
                                        className="btn btn-danger" style={{ fontSize: '10px', padding: '2px 3px' }}
                                        onClick={() =>
                                          RemoveBracket(
                                            index,
                                            "end",
                                            condition_item.end_bracket.length - 1,
                                            "buy"
                                          )
                                        }
                                      >
                                        <i className="fa-solid fa-xmark"></i>
                                      </button>
                                    ) : (
                                      ""
                                    )}

                                    <button
                                      className="btn btn-success mx-1" style={{ fontSize: '15px', padding: '2px 4px' }}
                                      onClick={() =>
                                        AddBracket(index, "end", "buy")
                                      }
                                    >
                                      {/* + Bracket */}
                                      <i className="fa-solid fa-circle-plus"></i>
                                    </button>

                                    <p
                                      style={{
                                        marginRight: "10px",
                                        fontSize: "larger",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {condition_item.end_bracket.join("")}
                                    </p>


                                  </td>

                                  <td>
                                    {coditionRequestArr.length >= 2 ? (
                                      condition_item.and_or_operator == "" ? (
                                        ""
                                      ) : (
                                        <select
                                          className="form-select"
                                          name="and_or"
                                          onChange={(e) => {
                                            selectAndOrOperaterChange(
                                              e,
                                              condition_item,
                                              index,
                                              "buy"
                                            );
                                          }}
                                        >
                                          {/* <option value="">Select Expiry Date</option> */}
                                          <option
                                            selected={
                                              condition_item.and_or_operator ==
                                              "and"
                                            }
                                            value="and"
                                          >
                                            AND
                                          </option>
                                          <option
                                            selected={
                                              condition_item.and_or_operator == "or"
                                            }
                                            value="or"
                                          >
                                            OR
                                          </option>
                                        </select>
                                      )
                                    ) : (
                                      ""
                                    )}

                                  </td>

                                  <td>

                                    {index == 0 ? (
                                      coditionRequestArr.length == 1 ? (
                                        <button
                                          className="btn btn-danger "
                                          onClick={() =>
                                            conditionRemove(index, "buy")
                                          }
                                          style={{
                                            fontSize: "10px",
                                            padding: "5px 10px",
                                          }}
                                        >
                                          Remove
                                        </button>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      <button
                                        className="btn btn-danger  "
                                        style={{
                                          fontSize: "10px",
                                          padding: "5px 10px",
                                        }}
                                        onClick={() =>
                                          conditionRemove(index, "buy")
                                        }
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </td>


                                </tr>
                              </>
                            )
                          })
                          }

                        </tbody>
                      </table>
                    </div>
                    <button
                      style={{ border: "1px dashed orange" }}
                      className="btn p-2"
                      onClick={() => conditionAdd(coditionRequestArr, "buy")}
                    >
                      + Add
                    </button>
                  </>

                ) : (
                  ""
                )}

                {condition_string != "" ? (
                  <li className="StepProgress-item">
                    <strong>Buy Exit Condition</strong>
                    <div className="row mt-3">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="text-danger">
                            Stop loss (point)
                          </label>
                          <input
                            type="number"
                            onChange={(e) => {
                              StoplossChange(e, "buy");
                            }}
                            className="form-control"
                          ></input>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="text-success">
                            Target Profit (point)
                          </label>
                          <input
                            type="number"
                            onChange={(e) => {
                              TargetChange(e, "buy");
                            }}
                            className="form-control"
                          ></input>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="">
                            Trailing SL (point) (optional)
                          </label>
                          <input
                            type="number"
                            onChange={(e) => {
                              TSLChange(e, "buy");
                            }}
                            className="form-control"
                          ></input>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  ""
                )}

              </li>

              <li
                className="StepProgress-item current is-done"
                style={{ marginTop: "50px" }}
              >
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    onChange={(e) => setSellCheck(e.target.checked)}
                    type="checkbox"
                    id="inlineCheckbox2"
                    value="option1"
                  />
                  <label className="form-check-label" htmlFor="inlineCheckbox2">
                    Sell
                  </label>
                </div>
                <strong>Sell Entry Condition</strong>

                {sellCheck == true ? (
                  <>
                    <h4>{condition_string_sell}</h4>
                    <div className="table-responsive w-100">
                      <table className="table">
                        <thead className="bg-transparent">
                          <tr>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>Bracket</th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>First</th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>Comparators</th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>Second</th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>Bracket</th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}></th>
                            <th className="text-dark text-center" style={{ fontSize: '15px' }}>Remove</th>
                          </tr>
                        </thead>
                        <tbody>

                          {coditionRequestArrSell && coditionRequestArrSell.map((condition_item, index) => {
                            return (
                              <>
                                <tr key={index}>
                                  <td >
                                    <button
                                      className="btn btn-success" style={{ fontSize: '15px', padding: '2px 5px' }}
                                      onClick={() =>
                                        AddBracket(index, "start", "sell")
                                      }
                                    >
                                      {/* + Bracket */}
                                      <i className="fa-solid fa-circle-plus"></i>
                                    </button>


                                    {condition_item.start_bracket.length > 0 ? (
                                      <button
                                        className="btn btn-danger mx-1" style={{ fontSize: '10px', padding: '2px 3px' }}
                                        onClick={() =>
                                          RemoveBracket(
                                            index,
                                            "start",
                                            condition_item.start_bracket.length - 1,
                                            "sell"
                                          )
                                        }
                                      >
                                        <i className="fa-solid fa-xmark"></i>
                                      </button>
                                    ) : (
                                      ""
                                    )}

                                    <p
                                      style={{
                                        marginRight: "10px",
                                        fontSize: "larger",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {condition_item.start_bracket.join("")}
                                    </p>
                                  </td>


                                  <td>
                                    <div className="d-flex">
                                      <select className="form-select" name="first_source"
                                        onChange={(e) => {
                                          selectSource(e, condition_item, "first", index, "sell");
                                        }}
                                      >
                                        <option value="">---</option>
                                        {getSources.data.map((sm, i) => (
                                          <option
                                            selected={
                                              condition_item.first_element.source ==
                                              sm.value
                                            }
                                            value={sm.value}
                                          >
                                            {sm.name}
                                          </option>
                                        ))}
                                      </select>

                                      <input
                                        type="number"
                                        defaultValue={
                                          condition_item.first_element.offset
                                        }
                                        onChange={(e) => {
                                          ChangeOffsetval(e, condition_item, "first", index, "sell");
                                        }}
                                        min="0"
                                        className="form-control w-50 ms-2"
                                      />
                                    </div>
                                  </td>

                                  <td>

                                    <select
                                      className="form-select" name="comparators"
                                      onChange={(e) => {
                                        selectComparators(e, condition_item, index, "sell");
                                      }}
                                    >
                                      {/* <option value="">---</option> */}
                                      {getComparators.data.map((sm, i) => (
                                        <option
                                          selected={
                                            condition_item.comparators == sm.value
                                          }
                                          value={sm.value}
                                        >
                                          {sm.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>



                                  <td>
                                    <div className="d-flex">

                                      <select className="form-select" name="second_source"
                                        onChange={(e) => {
                                          selectSource(e, condition_item, "second", index,
                                            "sell");
                                        }}
                                      >

                                        <option value="">---</option>
                                        {getSources.data.map((sm, i) => (
                                          <option
                                            selected={
                                              condition_item.second_element.source ==
                                              sm.value
                                            }
                                            value={sm.value}
                                          >
                                            {sm.name}
                                          </option>
                                        ))}
                                      </select>
                                      <input
                                        type="number"
                                        defaultValue={
                                          condition_item.second_element.offset
                                        }
                                        onChange={(e) => {
                                          ChangeOffsetval(e, condition_item, "second", index,
                                            "sell");
                                        }}
                                        min="0"
                                        className="form-control w-50 ms-2"
                                      />
                                    </div>
                                  </td>

                                  <td>

                                    {condition_item.end_bracket.length > 0 ? (
                                      <button
                                        className="btn btn-danger" style={{ fontSize: '10px', padding: '2px 3px' }}
                                        onClick={() =>
                                          RemoveBracket(
                                            index,
                                            "end",
                                            condition_item.end_bracket.length - 1,
                                            "sell"
                                          )
                                        }
                                      >
                                        <i className="fa-solid fa-xmark"></i>
                                      </button>
                                    ) : (
                                      ""
                                    )}

                                    <button
                                      className="btn btn-success mx-1" style={{ fontSize: '15px', padding: '2px 4px' }}
                                      onClick={() =>
                                        AddBracket(index, "end", "sell")
                                      }
                                    >
                                      {/* + Bracket */}
                                      <i className="fa-solid fa-circle-plus"></i>
                                    </button>

                                    <p
                                      style={{
                                        marginRight: "10px",
                                        fontSize: "larger",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {condition_item.end_bracket.join("")}
                                    </p>


                                  </td>

                                  <td>
                                    {coditionRequestArrSell.length >= 2 ? (
                                      condition_item.and_or_operator == "" ? (
                                        ""
                                      ) : (
                                        <div className="d-flex">
                                          <select
                                            className="form-select"
                                            name="and_or"
                                            onChange={(e) => {
                                              selectAndOrOperaterChange(
                                                e,
                                                condition_item,
                                                index,
                                                "sell"
                                              );
                                            }}
                                          >

                                            <option
                                              selected={
                                                condition_item.and_or_operator ==
                                                "and"
                                              }
                                              value="and"
                                            >
                                              AND
                                            </option>
                                            <option
                                              selected={
                                                condition_item.and_or_operator == "or"
                                              }
                                              value="or"
                                            >
                                              OR
                                            </option>
                                          </select>
                                        </div>
                                      )
                                    ) : (
                                      ""
                                    )}

                                  </td>

                                  <td>

                                    {index == 0 ? (
                                      coditionRequestArrSell.length == 1 ? (
                                        <button
                                          className="btn btn-danger "
                                          onClick={() =>
                                            conditionRemove(index, "sell")
                                          }
                                          style={{
                                            fontSize: "10px",
                                            padding: "5px 10px",
                                          }}
                                        >
                                          Remove
                                        </button>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      <button
                                        className="btn btn-danger  "
                                        style={{
                                          fontSize: "10px",
                                          padding: "5px 10px",
                                        }}
                                        onClick={() =>
                                          conditionRemove(index, "sell")
                                        }
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </td>


                                </tr>
                              </>
                            )
                          })
                          }

                        </tbody>
                      </table>
                    </div>
                    <button
                      style={{ border: "1px dashed orange" }}
                      className="btn p-2"
                      onClick={() => conditionAdd(coditionRequestArrSell, "sell")}
                    >
                      + Add
                    </button>
                  </>
                ) : (
                  ""
                )}


                {condition_string_sell != "" ? (
                  <li className="StepProgress-item">
                    <strong>Sell Exit Condition</strong>
                    <div className="row mt-3">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="text-danger">
                            Stop loss (point)
                          </label>
                          <input
                            type="number"
                            onChange={(e) => {
                              StoplossChange(e, "sell");
                            }}
                            className="form-control"
                          ></input>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="text-success">
                            Target Profit (point)
                          </label>
                          <input
                            type="number"
                            onChange={(e) => {
                              TargetChange(e, "sell");
                            }}
                            className="form-control"
                          ></input>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="">
                            Trailing SL (point) (optional)
                          </label>
                          <input
                            type="number"
                            onChange={(e) => {
                              TSLChange(e, "sell");
                            }}
                            className="form-control"
                          ></input>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  ""
                )}

              </li>
            </ul>

            <>
              <Modal show={showEnterPrice} onHide={handleCloseEnterPrice}>
                <Modal.Header closeButton>
                  <Modal.Title>Inputs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <label>Length</label>
                    <br />
                    <input type="number" min={0} defaultValue={0} />
                    <br />

                    <label>Source</label>
                    <br />
                    <select name="sources">
                      {/* {getSources && getSources.map((item, index) => (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      ))} */}
                    </select>
                    <br />

                    <label>Offset</label>
                    <br />
                    <input type="number" min={0} defaultValue={0} />
                    <br />

                    <br />
                    <label>SMOOTHING</label>
                    <br />

                    <label>Method</label>
                    <br />
                    {indicatorModalRowData &&
                      Array.isArray(indicatorModalRowData.data) && (
                        <select name="method">
                          {indicatorModalRowData.data.map((item, index) => (
                            <option
                              key={index}
                              value={item[Object.keys(item)[0]]}
                            >
                              {
                                indicatorModalRowData.data[index][
                                Object.keys(item)[0]
                                ]
                              }
                            </option>
                          ))}
                        </select>
                      )}
                    <br />

                    <label>EMA Length</label>
                    <br />
                    <input type="number" min={0} defaultValue={0} />
                    <br />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEnterPrice}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleCloseEnterPrice}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          </div>

          <div className="mt-5">
            <button
              className="btn btn-info float-start m-0"
              disabled={disableSaveButtun == true ? true : false}
              onClick={() => saveStrategy("e")}
            >
              save
            </button>
          </div>
        </Content>

        <Modal show={showModalOffset} onHide={closeModalOffset}>
          <Modal.Body>
            <p>
              <b>{selectedSource}</b>
            </p>
            {selectedSource == "number" ? "" : <label>Offset</label>}
            <Col md={2}>
              {selectedElementFirsSecond == "first" ? (
                <>
                  <input
                    type="number"
                    defaultValue={selectConditionItem.first_element.offset}
                    onChange={(e) => {
                      ChangeOffset(e);
                    }}
                    min="0"
                    className="form-control"
                  />
                </>
              ) : selectedElementFirsSecond == "second" ? (
                <>
                  <input
                    type="number"
                    defaultValue={selectConditionItem.second_element.offset}
                    onChange={(e) => {
                      ChangeOffset(e);
                    }}
                    min="0"
                    className="form-control"
                  />{" "}
                </>
              ) : (
                ""
              )}
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModalOffset}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                ModalConfirmOffset(
                  selectConditionItem,
                  selectedElementFirsSecond,
                  selectedIndexConditionArr,
                  selectedSource
                )
              }
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModalAndOrOperator} onHide={closeModalAndOrOperator}>
          <Modal.Body>
            <p>
              <b>{selectedSource}</b>
            </p>

            <label>Offset</label>

            <Col md={2}>
              <div className="radio">
                <label htmlFor="or">
                  <input
                    id="or"
                    value="or"
                    type="radio"
                    checked={selectAndOrOperater === "or"}
                    name="at_check"
                    onChange={(e) => {
                      setSelectAndOrOperater(e.target.value);
                    }}
                  />
                  OR
                </label>
              </div>

              <div className="radio">
                <label htmlFor="and">
                  <input
                    id="and"
                    value="and"
                    type="radio"
                    checked={selectAndOrOperater === "and"}
                    name="at_check"
                    onChange={(e) => {
                      setSelectAndOrOperater(e.target.value);
                    }}
                  />
                  AND
                </label>
              </div>
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModalAndOrOperator}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => ModalConfirmAndOrOperator(checkBuySellAndOr)}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <ToastButton />
      </>
    </>
  );
};

export default CreateStrategy;
