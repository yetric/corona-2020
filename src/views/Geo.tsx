import { Chart } from "../components/Chart";
import { Bars } from "../components/Bars";
import { Table } from "../components/Table";
import React, { useEffect, useState } from "react";
import { DataStore } from "../stores/DataStore";
import { observer } from "mobx-react";
import { Link, useParams, withRouter } from "react-router-dom";
import { Share } from "../components/Share";
import { favStore } from "../stores/FavStore";
import { Nearby } from "../components/Nearby";
import { SaveBtn } from "../components/SaveBtn";

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
            window.scrollTo(0, 0);
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

        const { confirmed, deaths, recovered } = dataStore;

        let showSaveBtn = true;
        if (country && dataStore.data?.geo) {
            showSaveBtn = !favStore.has({
                id: parseInt(country),
                name: dataStore.data.geo.country,
                province: dataStore.data.geo.province
            });
        }

        let casesPerHundraK = "";

        if (dataStore.metadata.population && dataStore.data?.confirmed.count) {
            let hundredK = parseInt(dataStore.metadata.population) / 100000;
            let relative = dataStore.data?.confirmed.count / hundredK;
            casesPerHundraK = (Math.round(relative * 10) / 10).toLocaleString("sv-se");
        }

        const provinces =
            dataStore.provinces.length > 0 ? getProvinceDropDown({ selected: dataStore.data?.geo.province }) : null;

        const chartOrLoading =
            dataStore.confirmed.data.length > 0 ? (
                <Chart
                    type={dataStore.renderType}
                    labels={dataSource.labels}
                    data={[confirmed, deaths, recovered]}
                    name={type}
                />
            ) : null;
        return (
            <div className={"geo-wrapper"}>
                <div className="card">
                    {dataStore.loading && (
                        <div className="loading-overlay">
                            <div>
                                <span>Loading Country Data ...</span>
                            </div>
                        </div>
                    )}
                    <div className="card-header">
                        {dataStore.data?.geo.country} {provinceName} {provinces}
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <h4>Accumulated</h4>

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
                                <h4>Daily</h4>
                                <Bars
                                    type={dataStore.barType}
                                    data={[confirmed, deaths, recovered]}
                                    labels={dataSource.labels}
                                />
                                <ul className={"toggle"}>
                                    <li className={dataStore.barType === "stacked" ? "active" : ""}>
                                        <a
                                            href={"#stacked"}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                dataStore.setBarChartType("stacked");
                                            }}>
                                            Stacked
                                        </a>
                                    </li>
                                    <li className={dataStore.barType === "normal" ? "active" : ""}>
                                        <a
                                            href={"#normal"}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                dataStore.setBarChartType("normal");
                                            }}>
                                            Normal
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="card">
                                    <div className="card-header">Right now</div>
                                    <div className="card-body">
                                        <dl>
                                            <dt>Confirmed</dt>
                                            <dd>
                                                {dataStore.data?.confirmed.count}{" "}
                                                <small>{dataStore.data?.confirmed.date}</small>
                                            </dd>

                                            <dt>Deaths</dt>
                                            <dd>
                                                {dataStore.data?.deaths.count}{" "}
                                                <small>{dataStore.data?.active.deathRate}%</small>
                                            </dd>

                                            <dt>Recovered</dt>
                                            <dd>
                                                {dataStore.data?.recovered.count}{" "}
                                                <small>{dataStore.data?.active.recoveryRate}%</small>
                                            </dd>

                                            <dt>Active</dt>
                                            <dd>
                                                {dataStore.data?.active.count}{" "}
                                                <small>{dataStore.data?.active.percentage}%</small>
                                            </dd>

                                            <dt>Cases/100K</dt>
                                            <dd>{casesPerHundraK}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <div className="card-header">
                                        {dataStore.metadata &&
                                            dataStore.metadata.flag &&
                                            dataStore.metadata.flag.length > 0 && (
                                                <img className={"flag"} alt={"flag"} src={dataStore.metadata.flag} />
                                            )}
                                        {dataStore.data?.geo.country} ({dataStore.metadata.abbr})
                                    </div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Population</th>
                                                <td>
                                                    {dataStore.metadata.population &&
                                                        parseInt(dataStore.metadata.population).toLocaleString("sv-se")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Capital</th>
                                                <td>{dataStore.metadata.capital}</td>
                                            </tr>
                                            <tr>
                                                <th>Continent</th>
                                                <td>
                                                    <Link to={"/continent/" + dataStore.metadata.continent}>
                                                        {dataStore.metadata.continent}
                                                    </Link>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Region</th>
                                                <td>
                                                    <Link to={"/region/" + dataStore.metadata.region}>
                                                        {dataStore.metadata.region}
                                                    </Link>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Life Expectancy</th>
                                                <td>
                                                    <Link to={"/expectancy/" + dataStore.metadata.life_expectancy}>
                                                        {dataStore.metadata.life_expectancy}
                                                    </Link>{" "}
                                                    years
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Population Density</th>
                                                <td>
                                                    <Link to={"/density/" + dataStore.metadata.population_density}>
                                                        {dataStore.metadata.population_density}
                                                    </Link>{" "}
                                                    people/km<sup>2</sup>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Avg Temp</th>
                                                <td>
                                                    <Link to={"/temperature/" + dataStore.metadata.average_temp}>
                                                        {dataStore.metadata.average_temp}
                                                    </Link>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Government</th>
                                                <td>
                                                    <Link to={"/government/" + dataStore.metadata.government}>
                                                        {dataStore.metadata.government}
                                                    </Link>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Near-by</th>
                                                <td>{country && <Nearby id={parseInt(country)} />}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <div className="card-header">By Date</div>
                                    <Table
                                        data={{
                                            labels: dataSource.labels,
                                            confirmed,
                                            deaths,
                                            recovered
                                        }}
                                        truncate={truncate}
                                    />
                                    <small>
                                        Only showing last 7 days in table{" "}
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
                        </div>
                    </div>
                    <div className="card-footer">
                        <Share />
                    </div>
                </div>

                {showSaveBtn && dataStore.data?.geo && country && (
                    <SaveBtn
                        id={parseInt(country)}
                        countryName={dataStore.data?.geo.country}
                        provinceName={dataStore.data?.geo.province}
                    />
                )}
            </div>
        );
    })
);
