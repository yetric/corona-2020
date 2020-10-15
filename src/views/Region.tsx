import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { RegionStore } from "../stores/RegionStore";
import { LocationList } from "../components/LocationList";
import { ReportStore } from "../stores/ReportStore";

const reportStore = new ReportStore();

const Region = observer(() => {
    let { region }: any = useParams();
    let regionStore: RegionStore;

    if (!region) {
        return null;
    }

    useEffect(() => {
        document.title = region + " - Covid-19 - CoronaData.se";
    });

    useEffect(() => {
        region && reportStore.loadReport("region:" + region);
    }, [region]);

    regionStore = new RegionStore(region);

    return (
        <>
            <LocationList report={reportStore.report} store={regionStore} title={"Region / " + region} />
        </>
    );
});

export default Region;
