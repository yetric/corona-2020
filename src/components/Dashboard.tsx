import React from "react";
import "./Dashboard.css";

export const Dashboard = () => {
    return (
        <div className={"row"} id={"dashboard"}>
            <div className="col col-2" id={"dashboard-map"}>
                Map
            </div>
            <div className="col col-1" id={"dashboard-countries"}>
                Top Countries
            </div>
        </div>
    );
};
