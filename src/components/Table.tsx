import React from "react";

interface DataProp {
    data: any[];
    labels: any[];
    ma: any[];
}

interface TableProps {
    data: DataProp;
}
export const Table = (props: TableProps) => {
    if(props.data.labels.length === 0 || props.data.data.length === 0) {
        return null;
    }
    let last = 0;
    const rows = props.data.labels.map((label: any, index: number) => {
        const now = props.data.data[index];
        const moving = parseInt(props.data.ma[index]);
        const change = now - last;
        const changeRelative = change / last;
        const total = props.data.data[index];
        if (total === 0) return null;
        last = now;
        return (
            <tr key={index}>
                <td>{label}</td>
                <td>{change}</td>
                <td>{total}</td>
                <td>{moving}</td>
                <td>{changeRelative > 0 && isFinite(changeRelative) && Math.round(changeRelative * 100) + "%"}</td>
            </tr>
        );
    });
    return (
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>New</th>
                    <th>Total</th>
                    <th>Moving Avg. (3 days)</th>
                    <th>Change</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
};
