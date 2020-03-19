import React, { useState } from "react";
import { DataStore } from "../stores/DataStore";
import { Chart } from "./Chart";
import { Toggle } from "./Toggle";

interface ActivityRateProps {
    dataStore: DataStore;
}

export const ActivityRate = ({ dataStore }: ActivityRateProps) => {
    const [type, setType] = useState("linear");
    return (
        <div>
            <h4>Activity</h4>
            <Chart
                type={type}
                labels={dataStore.labels}
                data={[dataStore.activityRate, dataStore.growthRate]}
                name={"Activity Rate"}
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
