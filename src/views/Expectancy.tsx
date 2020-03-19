import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { ExpectancyStore } from "../stores/ExpectancyStore";
import { LocationList } from "../components/LocationList";

export const Expectancy = observer(() => {
    let { expectancy } = useParams();
    let expectancyStore: ExpectancyStore;

    if (!expectancy) {
        return null;
    }

    useEffect(() => {
        document.title = "Life Expectancy " + expectancy + " (+-5%) - Covid-19 - CoronaData.se";
    });

    expectancyStore = new ExpectancyStore(parseFloat(expectancy));

    return (
        <>
            <LocationList
                confirmed={expectancyStore.confirmed}
                deaths={expectancyStore.deaths}
                recovered={expectancyStore.recovered}
                locations={expectancyStore.locations}
                title={"Life Expectancy / " + expectancy + " (+-5%)"}
                loading={expectancyStore.loading}
            />
        </>
    );
});