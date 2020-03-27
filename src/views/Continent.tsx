import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { ContinentStore } from "../stores/ContinentStore";
import { LocationList } from "../components/LocationList";

const Continent = observer(() => {
    let { continent } = useParams();
    if (!continent) return null;
    let continentStore = new ContinentStore(continent);

    useEffect(() => {
        document.title = continent + " - Covid-19 - CoronaData.se";
    });

    return (
        <>
            <LocationList store={continentStore} title={"Continent / " + continent} />
        </>
    );
});

export default Continent;
