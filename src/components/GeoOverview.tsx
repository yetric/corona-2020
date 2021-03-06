import React from "react";
import { observer } from "mobx-react";
import { ReportStore } from "../stores/ReportStore";
import { ReportCard } from "./ReportCard";

export const GeoOverview = observer(() => {
    return (
        <>
            <div className={"word-overview"}>
                <div className={"cards"}>
                    <ReportCard report={"world"} store={new ReportStore()} />
                    <ReportCard report={"continent:Europe"} store={new ReportStore()} />
                </div>
                <div className={"cards"}>
                    <ReportCard report={"Sweden"} store={new ReportStore()} />
                    <ReportCard report={"United Kingdom"} store={new ReportStore()} />
                </div>
                <div className={"cards"}>
                    <ReportCard report={"Germany"} store={new ReportStore()} />
                    <ReportCard report={"France"} store={new ReportStore()} />
                </div>
                <div className={"cards"}>
                    <ReportCard report={"US"} store={new ReportStore()} />
                    <ReportCard report={"Spain"} store={new ReportStore()} />
                </div>
                <div className={"cards"}>
                    <ReportCard report={"Italy"} store={new ReportStore()} />
                    <ReportCard report={"Korea, South"} store={new ReportStore()} />
                </div>
                <div className={"cards"}>
                    <ReportCard report={"Iran"} store={new ReportStore()} />
                    <ReportCard report={"Brazil"} store={new ReportStore()} />
                </div>
                <div className={"cards"}>
                    <ReportCard report={"Finland"} store={new ReportStore()} />
                    <ReportCard report={"Norway"} store={new ReportStore()} />
                </div>
                <div className={"cards"}>
                    <ReportCard report={"Denmark"} store={new ReportStore()} />
                    <ReportCard report={"Belgium"} store={new ReportStore()} />
                </div>
                <div className={"cards"}>
                    <ReportCard report={"Japan"} store={new ReportStore()} />
                    <ReportCard report={"Australia"} store={new ReportStore()} />
                </div>
                <div className={"cards"}>
                    <ReportCard report={"Russia"} store={new ReportStore()} />
                    <ReportCard report={"Netherlands"} store={new ReportStore()} />
                </div>
            </div>
        </>
    );
});
