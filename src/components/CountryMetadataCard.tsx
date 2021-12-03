import React from "react";
import { CountryMetadata } from "../stores/DataStore";
import { Link } from "react-router-dom";
import { CountryMap } from "./CountryMap";

interface CountryMetadataCardProps {
    metadata: CountryMetadata | null;
}

export const CountryMetadataCard = ({ metadata }: CountryMetadataCardProps) => {
    if (!metadata) {
        return null;
    }

    let coords = (metadata.coord && JSON.parse(metadata.coord)) || null;
    let geoJSON = (metadata.geometry && JSON.parse(metadata.geometry)) || null;

    return (
        <div className={"card"}>
            <div className="card-header">
                About {metadata.name} <small className={"meta"}>{metadata.abbr}</small>
            </div>
            <CountryMap coord={coords} geoJSON={geoJSON} />
            <div className="table-responsive">
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{metadata.name}</td>
                        </tr>
                        <tr>
                            <th>Abbrevation</th>
                            <td>{metadata.abbr}</td>
                        </tr>
                        <tr>
                            <th>Population</th>
                            <td>{metadata.population && parseInt(metadata.population).toLocaleString("sv-se")}</td>
                        </tr>
                        <tr>
                            <th>Capital</th>
                            <td>{metadata.capital}</td>
                        </tr>
                        <tr>
                            <th>Continent</th>
                            <td>
                                <Link to={"/report/continent:" + metadata.continent}>{metadata.continent}</Link>
                            </td>
                        </tr>
                        <tr>
                            <th>Region</th>
                            <td>
                                <Link to={"/report/region:" + metadata.region}>{metadata.region}</Link>
                            </td>
                        </tr>
                        <tr>
                            <th>Life Expectancy</th>
                            <td>
                                <Link to={"/expectancy/" + metadata.life_expectancy}>{metadata.life_expectancy}</Link>{" "}
                                years
                            </td>
                        </tr>
                        <tr>
                            <th>Population Density</th>
                            <td>
                                <Link to={"/density/" + metadata.population_density}>
                                    {metadata.population_density}
                                </Link>{" "}
                                people/km<sup>2</sup>
                            </td>
                        </tr>
                        <tr>
                            <th>Avg Temp</th>
                            <td>
                                <Link to={"/temperature/" + metadata.average_temp}>{metadata.average_temp}</Link>
                            </td>
                        </tr>
                        <tr>
                            <th>Government</th>
                            <td>
                                <Link to={"/government/" + metadata.government}>{metadata.government}</Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
