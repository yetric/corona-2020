import React, { useState } from "react";
import { DataStore } from "../stores/DataStore";
import { Chart } from "./Chart";
import { Toggle } from "./Toggle";
import { gray, green, orange, red, yellow } from "../core/colors";

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
                data={[dataStore.growthRate, dataStore.growthRatePlain]}
                colors={[orange, "#555555"]}
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
