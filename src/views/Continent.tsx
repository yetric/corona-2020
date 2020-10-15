import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { ContinentStore } from "../stores/ContinentStore";
import { LocationList } from "../components/LocationList";
import { ReportStore } from "../stores/ReportStore";

const reportStore = new ReportStore();

const Continent = observer(() => {
    let { continent }: any = useParams();
    if (!continent) return null;
    let continentStore = new ContinentStore(continent);

    useEffect(() => {
        document.title = continent + " - Covid-19 - CoronaData.se";
    });

    useEffect(() => {
        continent && reportStore.loadReport(`continent:${continent}`);
    }, [continent]);

    return (
        <>
            <LocationList report={reportStore.report} store={continentStore} title={"Continent / " + continent} />
        </>
    );
});

export default Continent;
