import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { RegionStore } from "../stores/RegionStore";
import { LocationList } from "../components/LocationList";

const Region = observer(() => {
    let { region } = useParams();
    let regionStore: RegionStore;

    if (!region) {
        return null;
    }

    useEffect(() => {
        document.title = region + " - Covid-19 - CoronaData.se";
    });

    regionStore = new RegionStore(region);

    return (
        <>
            <LocationList store={regionStore} title={"Region / " + region} />
        </>
    );
});

export default Region;
