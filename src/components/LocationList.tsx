import React from "react";
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

interface LocationListProps {
    store: ContinentStore | RegionStore | GovernmentStore | ExpectancyStore;
    title: string;
}

interface LocationListItemProps {
    item: GeoLocation;
}

export const LocationListItem = ({ item }: LocationListItemProps) => {
    let confirmed = parseInt(item.confirmed.count);
    let deaths = parseInt(item.deaths.count);
    let recovered = parseInt(item.recovered.count);
    let active = confirmed - (recovered + deaths);
    let deathRate = deaths > 0 ? deaths / confirmed : 0;
    let activityRate = active > 0 ? active / confirmed : 0;
    let recoveryRate = recovered > 0 ? recovered / confirmed : 0;

    return (
        <tr className={"location-list-item"} key={item.id}>
            <th>
                <Link to={"/" + item.id}>{item.country}</Link>
            </th>
            <td className={"confirmed text-right"}>{confirmed.toLocaleString("sv-se")}</td>
            <td className={"deaths text-right"}>{deaths.toLocaleString("sv-se")}</td>
            <td className={"recovered text-right"}>{recovered.toLocaleString()}</td>
            <td className={"text-right"}>{active.toLocaleString("sv-se")}</td>
            <td className={"text-right"}>{relativeToPercentage(deathRate)}</td>
            <td className={"text-right"}>{relativeToPercentage(activityRate)}</td>
            <td className={"text-right"}>{relativeToPercentage(recoveryRate)}</td>
        </tr>
    );
};

export const LocationList = observer(({ store, title }: LocationListProps) => {
    let deathRate = store.confirmed > 0 && store.deaths > 0 ? store.deaths / store.confirmed : null;
    let recoveryRate = store.confirmed > 0 && store.recovered > 0 ? store.recovered / store.confirmed : null;

    let active = store.confirmed > 0 ? store.confirmed - (store.deaths + store.recovered) : null;
    let activePercentage = active ? active / store.confirmed : null;
    const sort = (sortType: string) => {
        store.sort(sortType);
    };
    return (
        <div className="card">
            <LoadOverlay loading={store.loading} text={"Loading Location Data ..."} />
            <div className="card-header">{title}</div>
            <div className="card-body">
                <dl>
                    <dt>Confirmed</dt>
                    <dd>{store.confirmed.toLocaleString("sv-se")}</dd>

                    <dt>Deaths</dt>
                    <dd>
                        {store.deaths.toLocaleString("sv-se")} <small>{relativeToPercentage(deathRate)}</small>
                    </dd>

                    <dt>Recovered</dt>
                    <dd>
                        {store.recovered.toLocaleString("sv-se")} <small>{relativeToPercentage(recoveryRate)}</small>
                    </dd>
                    <dt>Active</dt>
                    <dd>
                        {active && active.toLocaleString("sv-se")}{" "}
                        <small>{relativeToPercentage(activePercentage)}</small>
                    </dd>
                </dl>
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
                            <th
                                onClick={() => {
                                    sort("recovered");
                                }}>
                                Recovered
                            </th>
                            <th
                                onClick={() => {
                                    sort("active");
                                }}>
                                Active
                            </th>
                            <th colSpan={3}>Death / Activity / Recovery</th>
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
                            <td>{store.recovered.toLocaleString("sv-se")}</td>
                            <td>{(store.confirmed - (store.deaths + store.recovered)).toLocaleString("sv-se")}</td>
                            <td>{relativeToPercentage(store.deaths / store.confirmed)}</td>
                            <td>{active && relativeToPercentage(active / store.confirmed)}</td>
                            <td>{relativeToPercentage(store.recovered / store.confirmed)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
});
