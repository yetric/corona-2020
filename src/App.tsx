import React, { useState } from "react";
import { DataStore } from "./stores/DataStore";
import { observer } from "mobx-react";
import { Table } from "./components/Table";
import { Chart } from "./components/Chart";
import {Select} from "./components/Select";

const dataStore = new DataStore();

const App = observer(() => {
    const [truncate, setTruncate] = useState(true);
    return (
        <div className={"chart"}>
            <h2>Data on Corona</h2>
            <Select onChange={(value: string) => {
                dataStore.loadCountry(value);
            }} countries={dataStore.countries} selected={dataStore.selectedCountry}  />
            <div className="row">
                <div className="col">
                    <ul className={"toggle"}>
                        <li className={dataStore.renderType === 'linear' ? "active" : ""}>
                            <a
                                href={"#linear"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    dataStore.setRenderType("linear");
                                }}>
                                Linear
                            </a>
                        </li>
                        <li className={dataStore.renderType === 'logarithmic' ? "active" : ""}>
                            <a
                                href={"#logarithmic"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    dataStore.setRenderType("logarithmic");
                                }}>
                                Logarithmic
                            </a>
                        </li>
                    </ul>
                    <Chart type={dataStore.renderType} labels={dataStore.labels} data={dataStore.data} name={"Confirmed"} />
                </div>
                <div className="col">
                    <Table
                        data={{
                            labels: dataStore.labels,
                            data: dataStore.data,
                            ma: dataStore.movingAvg
                        }}
                        truncate={truncate}
                    />
                    <small>Only showing last 10 days in table <a href={"#"} onClick={(event) => {
                        event.preventDefault();
                        setTruncate(!truncate);
                    }}>Show all</a></small>
                </div>
            </div>


            <p className={"footer"}>
                <a href={"https://github.com/CSSEGISandData/COVID-19"}>Data Source</a> - Graph by{" "}
                <a href={"https://yetric.com"}>Yetric AB</a> - Pull Requests Welcome{" "}
                <a href={"https://github.com/yetric/corona-2020"}>here</a>
            </p>
        </div>
    );
});

export default App;
