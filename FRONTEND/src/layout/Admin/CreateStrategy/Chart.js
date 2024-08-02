import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';
import Chart from "react-apexcharts";
import { get_candle_data } from "../../../ReduxStore/Slice/Common/make_strategy_slice";

const ChartComponent = ({ showModal, setshowModal, List, data1111 }) => {
    const dispatch = useDispatch();
    const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

    const [candleData, setCandleData] = useState({ loading: true, data: [] });

    const getAllCandleDataApi = async () => {
        await dispatch(
            get_candle_data({
                req: {
                    page: "1",
                    limit: "100",
                    tokensymbol: List.tokensymbol,
                    timeframe: List.timeframe
                },
                token: AdminToken,
            })
        )
        .unwrap()
        .then((response) => {
            setCandleData({
                loading: false,
                data: response.status ? response.data : [],
            });
        });
    };

    useEffect(() => {
        if (showModal) {
            getAllCandleDataApi();
        }
    }, [showModal]);

    let option_type = "CALL";
    if (List.option_type && List.option_type.toUpperCase() === "PE") {
        option_type = "PUT";
    }

    const symbol = List.segment === "O" || List.segment === "MO" || List.segment === "CO"
        ? `${List.symbol_name} ${List.expiry} ${option_type} ${List.strike_price}`
        : List.segment === "F" || List.segment === "MF" || List.segment === "CF"
            ? `${List.symbol_name} ${List.expiry} FUTURE`
            : List.symbol_name;

    const symbolName = `${symbol} ( ${List.exch_seg} )`;

    const data = {
        series: [
            {
                data: candleData.data
            }
        ],
        options: {
            chart: {
                type: "candlestick",
                height: 350,
            },
            title: {
                text: symbolName,
                align: "left",
            },
            xaxis: {
                type: "datetime",
            },
            yaxis: {
                tooltip: {
                    enabled: true,
                },
            },
            events: {
                markerClick: (event, chartContext, { seriesIndex, dataPointIndex }) => {
                    const series = chartContext.w.config.series[seriesIndex];
                    const selectedPoint = series.data[dataPointIndex];
                    // Handle marker click event
                },
            },
        }
    };

    return (
        <div>
            <Modal
                isOpen={showModal}
                size="xl"
                title="Chart Details"
                hideBtn={true}
                handleClose={() => { setshowModal(false); data1111([]); }}
            >
                <Chart
                    type="candlestick"
                    height={400}
                    options={data.options}
                    series={data.series}
                />
            </Modal>
        </div>
    );
};

export default ChartComponent;
