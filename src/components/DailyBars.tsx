import { Bars } from "./Bars";
import React from "react";
import { DataStore } from "../stores/DataStore";
import { observer } from "mobx-react";

interface DailyBarsProps {
    dataStore: DataStore;
}

export const DailyBars = observer(({ dataStore }: DailyBarsProps) => (
    <>
        <h4>Daily</h4>
        <Bars
            type={dataStore.barType}
            data={[dataStore.confirmed, dataStore.deaths, dataStore.recovered]}
            labels={dataStore.labels}
        />
        <ul className={"toggle"}>
            <li className={dataStore.barType === "stacked" ? "active" : ""}>
                <a
                    href={"#stacked"}
                    onClick={(event) => {
                        event.preventDefault();
                        dataStore.setBarChartType("stacked");
                    }}>
                    Stacked
                </a>
            </li>
            <li className={dataStore.barType === "normal" ? "active" : ""}>
                <a
                    href={"#normal"}
                    onClick={(event) => {
                        event.preventDefault();
                        dataStore.setBarChartType("normal");
                    }}>
                    Normal
                </a>
            </li>
        </ul>
    </>
));
