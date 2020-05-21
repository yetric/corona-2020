import { Link } from "react-router-dom";
import { Nearby } from "./Nearby";
import React from "react";
import { DataStore } from "../stores/DataStore";

interface CountryCardProps {
    dataStore: DataStore;
    country: number | null | undefined;
}

export const CountryCard = ({ dataStore, country }: CountryCardProps) => (
    <div className="card">
        <div className="card-header">
            {dataStore.metadata && dataStore.metadata.flag && dataStore.metadata.flag.length > 0 && (
                <img className={"flag"} alt={"flag"} src={dataStore.metadata.flag} />
            )}
            {dataStore.data?.geo.country} ({dataStore.metadata.abbr})
        </div>
        <div className="table-responsive">
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
                            <Link to={"/report/continent:" + dataStore.metadata.continent}>
                                {dataStore.metadata.continent}
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <th>Region</th>
                        <td>
                            <Link to={"/report/region:" + dataStore.metadata.region}>{dataStore.metadata.region}</Link>
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
                        <td>{country && <Nearby id={country} />}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);
