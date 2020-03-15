import { Chart } from "../components/Chart";
import { Bars } from "../components/Bars";
import { Table } from "../components/Table";
import React, { useEffect, useState } from "react";
import { DataStore } from "../stores/DataStore";
import { observer } from "mobx-react";
import { useParams, withRouter } from "react-router-dom";
import { Share } from "../components/Share";
import { Save } from "react-feather";
import { favStore } from "../stores/FavStore";

interface ProvinceProps {
    selected?: any;
}

interface GeoProps {
    history: any;
}

const dataStore = new DataStore();

export const Geo = withRouter(
    observer(({ history }: GeoProps) => {
        const [type, setType] = useState("confirmed");
        let { country } = useParams();
        useEffect(() => {
            country && dataStore.loadCountry(parseInt(country));
        }, [country]);

        useEffect(() => {
            if (dataStore.data?.geo.country) {
                document.title = dataStore.data?.geo.country + " - Covid-19 - CoronaData.se";
            }
        });

        const [truncate, setTruncate] = useState(true);

        let dataSource = dataStore.confirmed;
        if (type === "deaths") {
            dataSource = dataStore.deaths;
        } else if (type === "recovered") {
            dataSource = dataStore.recovered;
        }

        const provinceName = dataStore.provinces.length > 0 ? <small>({dataStore.data?.geo.province})</small> : null;

        const getProvinceDropDown = ({ selected }: ProvinceProps) => {
            const options = dataStore.provinces.map((province) => {
                return (
                    <option key={"province-dd-" + province.id} value={province.value}>
                        {province.province}
                    </option>
                );
            });
            return (
                <>
                    <select
                        onChange={(event) => {
                            event.preventDefault();
                            dataStore.provinces.forEach((p) => {
                                if (p.province === event.target.value) {
                                    history.push("/" + p.id);
                                }
                            });
                        }}
                        value={selected}>
                        {options}
                    </select>
                </>
            );
        };

        let showSaveBtn = true;
        if (country && dataStore.data?.geo) {
            showSaveBtn = !favStore.has({
                id: parseInt(country),
                name: dataStore.data.geo.country,
                province: dataStore.data.geo.province
            });
        }

        const provinces =
            dataStore.provinces.length > 0 ? getProvinceDropDown({ selected: dataStore.data?.geo.province }) : null;

        const chartOrLoading =
            dataStore.confirmed.data.length > 0 ? (
                <Chart type={dataStore.renderType} labels={dataSource.labels} data={dataSource.data} name={type} />
            ) : null;
        return (
            <>
                <div className="card">
                    <div className="card-header">
                        {dataStore.data?.geo.country} {provinces}
                    </div>
                    <div className="card-body">
                        <dl>
                            <dt>Confirmed</dt>
                            <dd>
                                {dataStore.data?.confirmed.count} <small>{dataStore.data?.confirmed.date}</small>
                            </dd>

                            <dt>Deaths</dt>
                            <dd>
                                {dataStore.data?.deaths.count} <small>{dataStore.data?.deaths.date}</small>
                            </dd>

                            <dt>Recovered</dt>
                            <dd>
                                {dataStore.data?.recovered.count} <small>{dataStore.data?.recovered.date}</small>
                            </dd>
                        </dl>
                    </div>
                    <div className="card-footer">
                        <Share />
                    </div>
                </div>

                {showSaveBtn && (
                    <a
                        href={"#save"}
                        onClick={(event: any) => {
                            event.preventDefault();
                            if (country && dataStore.data?.geo) {
                                favStore.save({
                                    id: parseInt(country),
                                    name: dataStore.data?.geo.country,
                                    province: dataStore.data.geo.province
                                });
                            }
                        }}
                        className={"btn btn-block"}>
                        <Save size={16} /> Save {dataStore.data?.geo.country} {provinceName}
                    </a>
                )}

                <div className="row">
                    <div className="col">
                        <h4>Total</h4>
                        <ul className={"toggle pull-right"}>
                            <li className={type === "confirmed" ? "active" : ""}>
                                <a
                                    href={"#confirmed"}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setType("confirmed");
                                    }}>
                                    Confirmed
                                </a>
                            </li>
                            <li className={type === "deaths" ? "active" : ""}>
                                <a
                                    href={"#deaths"}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setType("deaths");
                                    }}>
                                    Deaths
                                </a>
                            </li>
                            <li className={type === "recovered" ? "active" : ""}>
                                <a
                                    href={"#recovered"}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setType("recovered");
                                    }}>
                                    Recovered
                                </a>
                            </li>
                        </ul>
                        {/* Check for empty*/}
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
                        <Bars data={dataSource.data} labels={dataSource.labels} />
                    </div>
                    <div className="col">
                        <h4>Overview</h4>
                        <Table
                            data={{
                                labels: dataSource.labels,
                                data: dataSource.data
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
    })
);
