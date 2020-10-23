import React from "react";
import { Checkbox } from "./core/Checkbox";
import { NumBox } from "./NumBox";
import { ReportStore } from "../stores/ReportStore";

interface MovingAvgProps {
    store: ReportStore;
}

export const MovingAvg = ({ store }: MovingAvgProps) => (
    <div className={"controls"}>
        <Checkbox
            onChange={(flatten: boolean) => {
                store.setUseMovingAvg(flatten);
            }}
            checked={store.movingAvg}
            label={"Moving Avg."}
        />
        <NumBox
            onChange={(num: number) => {
                store.setMovingAvgSpan(num);
            }}
            enabled={store.movingAvg}
            value={store.movingAvgSpan}
            label={"%d days"}
        />
    </div>
);
