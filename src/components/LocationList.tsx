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

export const LocationListItem = ({ item }: LocationListItemProps) => (
    <tr className={"location-list-item"} key={item.id}>
        <th>
            <Link to={"/" + item.id}>{item.country}</Link>
        </th>
        <td className={"confirmed text-right"}>{item.confirmed.count.toLocaleString()}</td>
        <td className={"deaths text-right"}>{item.deaths.count.toLocaleString()}</td>
        <td className={"recovered text-right"}>{item.recovered.count.toLocaleString()}</td>
    </tr>
);

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
                            <td>{store.confirmed}</td>
                            <td>{store.deaths}</td>
                            <td>{store.recovered}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
});
