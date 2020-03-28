import React from "react";
import { TypeCollection } from "../stores/DataStore";

interface DataProp {
    confirmed: TypeCollection;
    deaths: TypeCollection;
    recovered: TypeCollection;
    labels: any[];
}

interface TableProps {
    data: DataProp;
    truncate?: boolean;
}
export const Table = ({ data, truncate = false }: TableProps) => {
    if (data.labels.length === 0 || data.confirmed.data.length === 0) {
        return null;
    }
    let lastConfirmed = 0;
    let lastDeath = 0;
    let lastRecovered = 0;

    const rows = data.labels.map((label: any, index: number) => {
        const confirmedNow = data.confirmed.data[index];
        const deathsNow = data.deaths.data[index];
        const recoveredNow = data.recovered.data[index];

        const changeConfirmed = confirmedNow - lastConfirmed;
        const changeRelative = changeConfirmed / lastConfirmed;
        const totalConfirmed = data.confirmed.data[index];

        const changeDeaths = deathsNow - lastDeath;
        const changeRelativeDeath = changeDeaths / lastDeath;
        const totalDeaths = data.deaths.data[index];

        const changeRecovered = recoveredNow - lastRecovered;
        const changeRelativeRecovered = changeRecovered / lastRecovered;
        const totalRecovered = data.recovered.data[index];

        if (totalConfirmed === 0) return null;
        lastConfirmed = confirmedNow;
        lastDeath = deathsNow;
        lastRecovered = recoveredNow;
        return (
            <tr key={index}>
                <td>{label}</td>
                <td className={"text-right dimmed"}>
                    <span className={"confirmed"}>{totalConfirmed}</span> /{" "}
                    <span className={"deaths"}>{totalDeaths}</span>/{" "}
                    <span className={"recovered"}>{totalRecovered}</span>
                </td>
                <td className={"text-right confirmed"}>
                    {changeConfirmed}{" "}
                    <small>
                        {changeRelative > 0 && isFinite(changeRelative) && Math.round(changeRelative * 100) + "%"}
                    </small>
                </td>
                <td className={"text-right deaths"}>
                    {changeDeaths}{" "}
                    <small>
                        {changeRelativeDeath > 0 &&
                            isFinite(changeRelativeDeath) &&
                            Math.round(changeRelativeDeath * 100) + "%"}
                    </small>
                </td>
                <td className={"text-right recovered"}>
                    {changeRecovered}{" "}
                    <small>
                        {changeRelativeRecovered > 0 &&
                            isFinite(changeRelativeRecovered) &&
                            Math.round(changeRelativeRecovered * 100) + "%"}
                    </small>
                </td>
            </tr>
        );
    });

    const clsName = truncate && rows.length > 10 ? "truncate" : "";
    return (
        <div className="table-responsive">
            <table className={clsName}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th className={"text-right"}>Total</th>
                        <th className={"text-center"} colSpan={3}>
                            Daily
                        </th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
                <caption>
                    <span className={"confirmed"}>Confirmed</span>
                    <span className={"deaths"}>Deaths</span>
                </caption>
            </table>
        </div>
    );
};
