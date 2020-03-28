import React, { useState } from "react";
import { GeoLocation } from "../models/GeoLocation";
import { Link } from "react-router-dom";
import "./LocationList.css";
import { relativeToPercentage } from "../core/functions";
import { Share } from "./Share";
import { LoadOverlay } from "./LoadOverlay";
import { observer } from "mobx-react";
import { ContinentStore } from "../stores/ContinentStore";
import { RegionStore } from "../stores/RegionStore";
import { GovernmentStore } from "../stores/GovernmentStore";
import { ExpectancyStore } from "../stores/ExpectancyStore";
import { ReportInterface } from "../stores/ReportStore";
import { Report } from "./Report";
import { Toggle } from "./Toggle";

interface LocationListProps {
    store: ContinentStore | RegionStore | GovernmentStore | ExpectancyStore;
    title: string;
    report?: ReportInterface | null;
}

interface LocationListItemProps {
    item: GeoLocation;
}

export const LocationListItem = ({ item }: LocationListItemProps) => {
    if (!item.confirmed) {
        return null;
    }

    let confirmed = parseInt(item.confirmed.count);
    let deaths = parseInt(item.deaths.count);
    let recovered = (item.recovered && item.recovered.count && parseInt(item.recovered.count)) || 0;
    let active = confirmed - (recovered + deaths);
    let deathRate = deaths > 0 ? deaths / confirmed : 0;
    let activityRate = active > 0 ? active / confirmed : 0;
    let recoveryRate = recovered > 0 ? recovered / confirmed : 0;

    return (
        <tr className={"location-list-item important-column"} key={item.id}>
            <th>
                <Link to={"/" + item.id}>{item.country}</Link>
            </th>
            <td className={"confirmed text-right"}>{confirmed.toLocaleString("sv-se")}</td>
            <td className={"deaths text-right"}>{deaths.toLocaleString("sv-se")}</td>
            <td className={"text-right"}>{relativeToPercentage(deathRate)}</td>
        </tr>
    );
};

export const LocationList = observer(({ store, title, report }: LocationListProps) => {
    let deathRate = store.confirmed > 0 && store.deaths > 0 ? store.deaths / store.confirmed : null;
    let recoveryRate = store.confirmed > 0 && store.recovered > 0 ? store.recovered / store.confirmed : null;

    let active = store.confirmed > 0 ? store.confirmed - (store.deaths + store.recovered) : null;
    let activePercentage = active ? active / store.confirmed : null;

    const [listType, setListType] = useState("linear");
    const sort = (sortType: string) => {
        store.sort(sortType);
    };
    return (
        <div className="card">
            <LoadOverlay loading={store.loading} text={"Loading Location Data ..."} />
            <div className="card-header">{title}</div>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        {report && (
                            <>
                                <Report type={listType} report={report} />
                                <Toggle
                                    items={[
                                        {
                                            key: "linear",
                                            label: "Linear"
                                        },
                                        {
                                            key: "logarithmic",
                                            label: "Logarithmic"
                                        }
                                    ]}
                                    selected={listType}
                                    onSelect={setListType}
                                />
                            </>
                        )}
                    </div>
                    <div className="col">
                        <dl>
                            <dt>Confirmed</dt>
                            <dd className={"confirmed"}>{store.confirmed.toLocaleString("sv-se")}</dd>

                            <dt>Deaths</dt>
                            <dd className={"deaths"}>
                                {store.deaths.toLocaleString("sv-se")} <small>{relativeToPercentage(deathRate)}</small>
                            </dd>

                            <dt>Recovered</dt>
                            <dd className={"recovered"}>
                                {store.recovered.toLocaleString("sv-se")}{" "}
                                <small>{relativeToPercentage(recoveryRate)}</small>
                            </dd>

                            <dt>Active</dt>
                            <dd className={"active"}>
                                {active && active.toLocaleString("sv-se")}{" "}
                                <small>{relativeToPercentage(activePercentage)}</small>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <Share />
            </div>
            <div className="table-responsive">
                <table className={"location-list"}>
                    <thead>
                        <tr>
                            <th
                                onClick={() => {
                                    sort("country");
                                }}>
                                Country
                            </th>
                            <th
                                onClick={() => {
                                    sort("confirmed");
                                }}>
                                Confirmed
                            </th>
                            <th
                                onClick={() => {
                                    sort("deaths");
                                }}>
                                Deaths
                            </th>
                            <th className={"text-center"} colSpan={3}>
                                Rates - Death
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.locations.map((item: GeoLocation) => (
                            <LocationListItem key={item.id} item={item} />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <td>{store.confirmed.toLocaleString("sv-se")}</td>
                            <td>{store.deaths.toLocaleString("sv-se")}</td>
                            <td>{relativeToPercentage(store.deaths / store.confirmed)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
});
