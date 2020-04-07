import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Edit } from "react-feather";
import { ReportStore } from "../stores/ReportStore";
import { ReportCard } from "./ReportCard";

export const GeoOverview = observer(() => {
    return (
        <>
            <div className={"cards"}>
                <ReportCard report={"world"} store={new ReportStore()} />
                <ReportCard report={"continent:Europe"} store={new ReportStore()} />
                <ReportCard report={"Sweden"} store={new ReportStore()} />
            </div>
            <div className={"cards"}>
                <ReportCard report={"United Kingdom"} store={new ReportStore()} />
                <ReportCard report={"Germany"} store={new ReportStore()} />
                <ReportCard report={"France"} store={new ReportStore()} />
            </div>
            <div className="cards">
                <ReportCard report={"US"} store={new ReportStore()} />
                <ReportCard report={"Spain"} store={new ReportStore()} />
                <ReportCard report={"Italy"} store={new ReportStore()} />
            </div>
            <div className="cards">
                <ReportCard report={"region:Nordic Countries"} store={new ReportStore()} />
                <ReportCard report={"Norway"} store={new ReportStore()} />
                <ReportCard report={"Denmark"} store={new ReportStore()} />
            </div>
        </>
    );
});
