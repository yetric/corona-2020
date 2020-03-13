import { Chart } from "../components/Chart";
import { Bars } from "../components/Bars";
import { Table } from "../components/Table";
import React, { useEffect, useState } from "react";
import { DataStore } from "../stores/DataStore";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";

const dataStore = new DataStore();

export const Home = observer(() => {
    let { country } = useParams();
    useEffect(() => {
        country && dataStore.loadCountry(parseInt(country));
    }, [country]);
    const [truncate, setTruncate] = useState(true);

    const chartOrLoading = dataStore.confirmed.data.length > 0 ? <Chart type={dataStore.renderType} labels={dataStore.confirmed.labels} data={dataStore.confirmed.data} name={"Confirmed"} /> : null;
    return (
        <>
            <div className="card">
                <div className="card-header">{dataStore.data?.geo.country} {dataStore.data?.geo.province && dataStore.data?.geo.province}</div>
                <div className="card-body">
                    <dl>
                        <dt>Confirmed</dt>
                        <dd>{dataStore.data?.confirmed.count} <small>{dataStore.data?.confirmed.date}</small></dd>

                        <dt>Deaths</dt>
                        <dd>{dataStore.data?.deaths.count} <small>{dataStore.data?.deaths.date}</small></dd>

                        <dt>Recovered</dt>
                        <dd>{dataStore.data?.recovered.count} <small>{dataStore.data?.recovered.date}</small></dd>
                    </dl>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Accumulated</h4>
                    {/*<ul className={"toggle"}>
                        <li><a href={"#confirmed"}>Confirmed</a></li>
                        <li><a href={"#deaths"}>Deaths</a></li>
                        <li><a href={"#recovered"}>Recovered</a></li>
                    </ul>*/}
                    { /* Check for empty*/ }
                    {chartOrLoading}
                    <ul className={"toggle"}>
                        <li className={dataStore.renderType === "linear" ? "active" : ""}>
                            <a
                                href={"#linear"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    dataStore.setRenderType("linear");
                                }}>
                                Linear
                            </a>
                        </li>
                        <li className={dataStore.renderType === "logarithmic" ? "active" : ""}>
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
                </div>
                <div className="col">
                    <h4>New cases</h4>
                    <Bars data={dataStore.confirmed.data} labels={dataStore.confirmed.labels}/>
                </div>
                <div className="col">
                    <h4>Overview</h4>
                    <Table
                        data={{
                            labels: dataStore.confirmed.labels,
                            data: dataStore.confirmed.data
                        }}
                        truncate={truncate}
                    />
                    <small>
                        Only showing last 10 days in table{" "}
                        <a
                            href={"#"}
                            onClick={(event) => {
                                event.preventDefault();
                                setTruncate(!truncate);
                            }}>
                            Show all
                        </a>
                    </small>
                </div>
            </div>
        </>
    );
});
