import React from "react";
import { GeoCollection, GeoOverview, ReportStore } from "../stores/ReportStore";
import { Link } from "react-router-dom";
import { relativeToPercentage } from "../core/functions";
import { observer } from "mobx-react";

interface CountryTableProps {
    store: ReportStore | null;
}

const collectionToRows = (collection: GeoCollection) => {
    let rows = [];
    for (let key in collection) {
        if (!collection.hasOwnProperty(key)) continue;
        let country: GeoOverview = collection[key];
        rows.push(
            <tr key={key}>
                <td>
                    <Link to={"/report/" + key}>{key}</Link>
                </td>
                <td className={"text-right confirmed"}>{country.confirmed.toLocaleString("sv-se")}</td>
                <td className={"text-right deaths"}>
                    {country.deaths.toLocaleString("sv-se")}
                    <br />
                    <small className={"deaths"}>{relativeToPercentage(country.deathRate)}</small>
                </td>
                <td className={"text-right recovered"}>
                    {country.recovered.toLocaleString("sv-se")}
                    <br />
                    <small className={"recovered"}>{relativeToPercentage(country.recoveryRate)}</small>
                </td>
                <td className={"text-right active"}>
                    {country.active.toLocaleString("sv-se")}
                    <br />
                    <small className={"active"}>{relativeToPercentage(country.activityRate)}</small>
                </td>
            </tr>
        );
    }
    return rows;
};

export const CountryTable = observer(({ store }: CountryTableProps) => {
    return store && store.collection ? (
        <div className={"card"}>
            <div className="card-header">Countries</div>
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => store.sortBy("country")}>Country</th>
                            <th onClick={() => store.sortBy("confirmed")} className={"text-right"}>
                                Cases
                            </th>
                            <th onClick={() => store.sortBy("deaths")} className={"text-right"}>
                                Deaths
                            </th>
                            <th onClick={() => store.sortBy("recovered")} className={"text-right"}>
                                Recovered
                            </th>
                            <th onClick={() => store.sortBy("active")} className={"text-right"}>
                                Active
                            </th>
                        </tr>
                    </thead>
                    <tbody>{collectionToRows(store.collection)}</tbody>
                </table>
            </div>
        </div>
    ) : null;
});
