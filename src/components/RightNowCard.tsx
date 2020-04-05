import React from "react";
import { DataStore } from "../stores/DataStore";
import { relativeToPercentage } from "../core/functions";

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
                    {dataStore.data?.confirmed.count.toLocaleString("sv-se")}{" "}
                    <small>{dataStore.data?.confirmed.date}</small>
                </dd>

                <dt>Deaths</dt>
                <dd className={"deaths"}>
                    {dataStore.data?.deaths.count.toLocaleString("sv-se")}{" "}
                    <small>{dataStore.data?.active.deathRate}%</small>
                </dd>

                <dt>Recovered</dt>
                <dd className={"recovered"}>
                    {dataStore.data?.recovered.count.toLocaleString("sv-se")}{" "}
                    <small>{dataStore.data?.active.recoveryRate}%</small>
                </dd>

                <dt>Active</dt>
                <dd className={"active"}>
                    {dataStore.data?.active.count.toLocaleString("sv-se")}{" "}
                    <small>
                        {dataStore.data &&
                            dataStore.data.active &&
                            relativeToPercentage(dataStore.data.active.count / dataStore.data.confirmed.count)}
                    </small>
                </dd>

                <dt>Incidens</dt>
                <dd className={"muted"}>
                    {casesPerHundraK} <small>cases / 100K</small>
                </dd>
            </dl>
        </div>
    </div>
);
