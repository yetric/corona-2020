import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { ContinentStore } from "../stores/ContinentStore";
import { LocationList } from "../components/LocationList";

export const Continent = observer(() => {
    let { continent } = useParams();
    let continentStore: ContinentStore;

    if (!continent) {
        return null;
    }

    useEffect(() => {
        document.title = continent + " - Covid-19 - CoronaData.se";
    });

    continentStore = new ContinentStore(continent);

    return (
        <>
            <LocationList
                recovered={continentStore.recovered}
                deaths={continentStore.deaths}
                confirmed={continentStore.confirmed}
                locations={continentStore.locations}
                title={"Continent / " + continent}
                onSort={continentStore.sort}
                loading={continentStore.loading}
            />
        </>
    );
});
