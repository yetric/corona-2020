import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ReportStore } from "../stores/ReportStore";
import { ReportCard } from "../components/ReportCard";
import { LoadingView } from "./Loading";
import { reportUrlToHeader } from "../core/utils";

const Country = () => {
    let { country }: any = useParams();
    useEffect(() => {
        if (country) {
            document.title =
                decodeURIComponent(country)
                    .split(":")
                    .map((item) => {
                        return item.charAt(0).toUpperCase() + item.slice(1);
                    })
                    .join(" / ") + " - Covid-19 - CoronaData.se";
        }
    });
    let markup = country ? (
        <>
            <ul className={"breadcrumbs"}>
                <li>
                    <Link to={"/"}>Home</Link>
                </li>
                <li className={"active"}>{reportUrlToHeader(country)}</li>
            </ul>
            <div className={"cards"}>
                <ReportCard standalone={true} report={country} store={new ReportStore()} />
            </div>
        </>
    ) : (
        <LoadingView />
    );

    return <>{markup}</>;
};

export default Country;
