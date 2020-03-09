import React from "react";
import { DataStore } from "./stores/DataStore";
import { observer } from "mobx-react";
import { Table } from "./components/Table";
import { Chart } from "./components/Chart";
import {Select} from "./components/Select";

const dataStore = new DataStore();

const App = observer(() => {
    return (
        <div className={"chart"}>
            <h2>Data on Corona in Sweden</h2>
            <Select onChange={(value: string) => {
                console.log(value);
                dataStore.loadCountry(value);
            }} countries={dataStore.countries}  />
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
                    />
                    <small>Only showing last 10 days in table</small>
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
