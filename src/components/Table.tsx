import React from "react";

interface DataProp {
    data: any[];
    labels: any[];
}

interface TableProps {
    data: DataProp;
    truncate: boolean;
}
export const Table = ({data, truncate = true}: TableProps) => {
    if(data.labels.length === 0 || data.data.length === 0) {
        return null;
    }
    let last = 0;
    const rows = data.labels.map((label: any, index: number) => {
        const now = data.data[index];
        const change = now - last;
        const changeRelative = change / last;
        const total = data.data[index];
        if (total === 0) return null;
        last = now;
        return (
            <tr key={index}>
                <td>{label}</td>
                <td>{change}</td>
                <td>{total}</td>
                <td>{changeRelative > 0 && isFinite(changeRelative) && Math.round(changeRelative * 100) + "%"}</td>
            </tr>
        );
    });

    const clsName = truncate ? "truncate" : "";
    return (
        <table className={clsName}>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>New</th>
                    <th>Total</th>
                    <th>Change</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
};
