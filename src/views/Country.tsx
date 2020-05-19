import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReportStore } from "../stores/ReportStore";
import { ReportCard } from "../components/ReportCard";
import { LoadingView } from "./Loading";

const Country = () => {
    let { country } = useParams();
    useEffect(() => {
        if (country) {
            document.title = country + " - Covid-19 - CoronaData.se";
        }
    });
    let markup = country ? (
        <div className={"cards"}>
            <ReportCard standalone={true} report={country} store={new ReportStore()} />
        </div>
    ) : (
        <LoadingView />
    );

    return <>{markup}</>;
};

export default Country;
