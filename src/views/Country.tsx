import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReportStore } from "../stores/ReportStore";
import { ReportCard } from "../components/ReportCard";
import { LoadingView } from "./Loading";
import { Share } from "../components/Share";

const Country = () => {
    let { country } = useParams();
    useEffect(() => {
        if (country) {
            document.title = country + " - Covid-19 - CoronaData.se";
        }
    });
    return country ? (
        <div className={"cards"}>
            <ReportCard standalone={true} report={country} store={new ReportStore()} />
            <div className="card">
                <div className="card-header">More info</div>
                <div className="card-body">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium cumque delectus dolor
                    dolorem earum, et neque nesciunt, numquam possimus praesentium veritatis? Atque eius facilis maxime
                    nesciunt quae qui quia?
                </div>
                <div className="card-footer">
                    <Share />
                </div>
            </div>
        </div>
    ) : (
        <LoadingView />
    );
};

export default Country;
