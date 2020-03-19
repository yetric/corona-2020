import React, { useState } from "react";
import { DataStore } from "../stores/DataStore";
import { Chart } from "./Chart";
import { Toggle } from "./Toggle";

interface GrowthProps {
    dataStore: DataStore;
}

export const Growth = ({ dataStore }: GrowthProps) => {
    const [type, setType] = useState("linear");
    return (
        <div>
            <h4>Rates</h4>
            <Chart
                type={type}
                labels={dataStore.labels}
                data={[dataStore.recoveryRate, dataStore.deathRate]}
                name={"Death Rate"}
            />
            <Toggle
                items={[
                    {
                        key: "linear",
                        label: "Linear"
                    },
                    {
                        key: "logarithmic",
                        label: "Logarithmic"
                    }
                ]}
                selected={type}
                onSelect={setType}
            />
        </div>
    );
};
