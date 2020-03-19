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
                <dd>
                    {dataStore.data?.confirmed.count} <small>{dataStore.data?.confirmed.date}</small>
                </dd>

                <dt>Deaths</dt>
                <dd>
                    {dataStore.data?.deaths.count} <small>{dataStore.data?.active.deathRate}%</small>
                </dd>

                <dt>Recovered</dt>
                <dd>
                    {dataStore.data?.recovered.count} <small>{dataStore.data?.active.recoveryRate}%</small>
                </dd>

                <dt>Active</dt>
                <dd>
                    {dataStore.data?.active.count} <small>{dataStore.data?.active.percentage}%</small>
                </dd>

                <dt>Cases/100K</dt>
                <dd>{casesPerHundraK}</dd>
            </dl>
        </div>
    </div>
);
