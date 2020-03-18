import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { GovernmentStore } from "../stores/GovernmentStore";
import { LocationList } from "../components/LocationList";

export const Government = observer(() => {
    let { government } = useParams();
    let governmentStore: GovernmentStore;

    if (!government) {
        return null;
    }

    useEffect(() => {
        document.title = government + " - Covid-19 - CoronaData.se";
    });

    governmentStore = new GovernmentStore(government);

    return (
        <>
            <LocationList
                confirmed={governmentStore.confirmed}
                deaths={governmentStore.deaths}
                recovered={governmentStore.recovered}
                locations={governmentStore.locations}
                title={"Government / " + government}
            />
        </>
    );
});
