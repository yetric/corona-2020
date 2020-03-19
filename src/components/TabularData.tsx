import { Table } from "./Table";
import React, { useState } from "react";
import { DataStore } from "../stores/DataStore";

interface TabularDataProps {
    dataStore: DataStore;
}

export const TabularData = ({ dataStore }: TabularDataProps) => {
    const [truncate, setTruncate] = useState(true);
    return (
        <div className="card">
            <div className="card-header">By Date</div>
            <Table
                data={{
                    labels: dataStore.labels,
                    confirmed: dataStore.confirmed,
                    deaths: dataStore.deaths,
                    recovered: dataStore.recovered
                }}
                truncate={truncate}
            />
            <small>
                Only showing last 7 days in table{" "}
                <a
                    href={"#truncate"}
                    onClick={(event) => {
                        event.preventDefault();
                        setTruncate(!truncate);
                    }}>
                    Show all
                </a>
            </small>
        </div>
    );
};
