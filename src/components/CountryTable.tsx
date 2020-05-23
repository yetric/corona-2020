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
                <td className={"text-right deaths"}>{country.deaths.toLocaleString("sv-se")}</td>
                <td className={"text-right recovered"}>{country.recovered.toLocaleString("sv-se")}</td>
                <td className={"text-right active"}>{country.active.toLocaleString("sv-se")}</td>
                <td className={"text-right deaths"}>{relativeToPercentage(country.deathRate)}</td>
                <td className={"text-right recovered"}>{relativeToPercentage(country.recoveryRate)}</td>
                <td className={"text-right active"}>{relativeToPercentage(country.activityRate)}</td>
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
                            <th onClick={() => store.sortBy("deathRate")} className={"text-right"}>
                                Death Rate
                            </th>
                            <th onClick={() => store.sortBy("recoveryRate")} className={"text-right"}>
                                Recovery Rate
                            </th>
                            <th onClick={() => store.sortBy("activityRate")} className={"text-right"}>
                                Acitivity Rate
                            </th>
                        </tr>
                    </thead>
                    <tbody>{collectionToRows(store.collection)}</tbody>
                </table>
            </div>
        </div>
    ) : null;
});
