import React from "react";
import { CasesList } from "./CasesList";

export const GeoOverview = () => (
    <div className={"cards"}>
        <div className="card">
            <div className="card-header">World</div>
            <div className="card-body">
                <CasesList />
            </div>
            <div className="card-footer">WiP - Coming</div>
        </div>

        <div className="card">
            <div className="card-header">Europe</div>
            <div className="card-body">
                <CasesList />
            </div>
            <div className="card-footer">WiP - Coming</div>
        </div>

        <div className="card">
            <div className="card-header">Sweden</div>
            <div className="card-body">
                <CasesList />
            </div>
            <div className="card-footer">WiP - Coming</div>
        </div>
    </div>
);
