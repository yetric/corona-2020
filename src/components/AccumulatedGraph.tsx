import React from "react";
import { Chart } from "./Chart";
import { DataStore } from "../stores/DataStore";
import { observer } from "mobx-react";

interface AccumulatedGraphProps {
    dataStore: DataStore;
}

export const AccumulatedGraph = observer(({ dataStore }: AccumulatedGraphProps) => {
    const chartOrLoading =
        dataStore.confirmed.data.length > 0 ? (
            <Chart
                type={dataStore.renderType}
                labels={dataStore.labels}
                data={[dataStore.confirmed, dataStore.deaths, dataStore.recovered, dataStore.active]}
                name={dataStore.renderType}
            />
        ) : null;
    return (
        <div style={{ position: "relative" }}>
            <h4>Accumulated</h4>

            {chartOrLoading}
            <ul className={"toggle"}>
                <li className={dataStore.renderType === "linear" ? "active" : ""}>
                    <a
                        href={"#linear"}
                        onClick={(event) => {
                            event.preventDefault();
                            dataStore.setRenderType("linear");
                        }}>
                        Linear
                    </a>
                </li>
                <li className={dataStore.renderType === "logarithmic" ? "active" : ""}>
                    <a
                        href={"#logarithmic"}
                        onClick={(event) => {
                            event.preventDefault();
                            dataStore.setRenderType("logarithmic");
                        }}>
                        Logarithmic
                    </a>
                </li>
            </ul>
        </div>
    );
});
