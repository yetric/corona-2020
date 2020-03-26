import React from "react";
import { DataStore } from "../stores/DataStore";

interface RightNowCardProps {
    dataStore: DataStore;
    casesPerHundraK: any;
}

export const RightNowCard = ({ dataStore, casesPerHundraK }: RightNowCardProps) => (
    <div className="card">
        <div className="card-header">Right now</div>
        <div className="card-body">
            <dl>
                <dt>Confirmed</dt>
                <dd className={"confirmed"}>
                    {dataStore.data?.confirmed.count} <small>{dataStore.data?.confirmed.date}</small>
                </dd>

                <dt>Deaths</dt>
                <dd className={"deaths"}>
                    {dataStore.data?.deaths.count} <small>{dataStore.data?.active.deathRate}%</small>
                </dd>

                <dt>Cases/100K</dt>
                <dd className={"muted"}>{casesPerHundraK}</dd>
            </dl>
        </div>
    </div>
);
