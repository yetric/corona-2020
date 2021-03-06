import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { GovernmentStore } from "../stores/GovernmentStore";
import { LocationList } from "../components/LocationList";

const Government = observer(() => {
    let { government }: any = useParams();
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
            <LocationList store={governmentStore} title={"Government / " + government} />
        </>
    );
});

export default Government;
