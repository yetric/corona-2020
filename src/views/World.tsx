import React, { useEffect } from "react";
import { createData } from "../core/helpers";
import { blue, purple, red, yellow } from "../core/colors";
import { IncidensStore } from "../stores/IncidensStore";
import { HorizontalDataBar } from "../components/HorizontalDataBar";
import { observer } from "mobx-react";

let store = new IncidensStore();

const World = observer(() => {
    useEffect(() => {
        document.title = "World Overview - Covid-19 - CoronaData.se";
    });

    const deaths = createData(store.deathLabels, store.deathData, red);
    const cases = createData(store.confirmedLabels, store.confirmedhData, blue);
    const doubling = createData(store.doublingLabels, store.doublingData, purple);
    const growth = createData(store.growthLabels, store.growthData, yellow);

    return (
        <div>
            <div className={"cards horizontal-bars"}>
                <HorizontalDataBar data={deaths} descr={"Min. 1M population"} name={"Deaths / 100K"} />
                <HorizontalDataBar data={cases} descr={"Min. 1M population"} name={"Confirmed Cases / 100K"} />
            </div>
            <div className={"cards horizontal-bars"}>
                <HorizontalDataBar
                    data={doubling}
                    descr={"Deaths - Min. 50 deaths total"}
                    name={"Doubling Speed (days)"}
                />
                <HorizontalDataBar
                    data={growth}
                    descr={"Deaths - Min. 50 deaths total"}
                    name={"Last 3 Days of Total (%)"}
                />
            </div>
        </div>
    );
});

export default World;
