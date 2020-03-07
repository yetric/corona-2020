import React, { useState } from "react";
import { DataStore } from "./stores/DataStore";
import { observer } from "mobx-react";
import { Table } from "./components/Table";
import { Chart } from "./components/Chart";

const dataStore = new DataStore();
const App = observer(() => {
    const [chartType, setChartType] = useState("logarithmic");
    return (
        <div className={"chart"}>
            <h2>Data on Corona in Sweden</h2>
            <ul className={"toggle"}>
                <li>
                    <a
                        href={"#linear"}
                        onClick={(event) => {
                            event.preventDefault();
                            setChartType("linear");
                        }}>
                        Linear
                    </a>
                </li>
                <li>
                    <a
                        href={"#logarithmic"}
                        onClick={(event) => {
                            event.preventDefault();
                            setChartType("logarithmic");
                        }}>
                        Logarithmic
                    </a>
                </li>
            </ul>
            <Chart type={chartType} labels={dataStore.labels} data={dataStore.data} name={"Confirmed Cases Sweden"} />
            <Table
                data={{
                    labels: dataStore.labels,
                    data: dataStore.data
                }}
            />
            <p>
                <a href={"https://github.com/CSSEGISandData/COVID-19"}>Data Source</a> - Graph by{" "}
                <a href={"https://yetric.com"}>Yetric AB</a> - Pull Requests Welcome{" "}
                <a href={"https://github.com/yetric/corona-2020"}>here</a>
            </p>
        </div>
    );
});

export default App;
