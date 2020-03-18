import React from "react";
import { GeoLocation } from "../models/GeoLocation";
import { Link } from "react-router-dom";
import "./LocationList.css";
import { relativeToPercentage } from "../core/functions";
import { Share } from "./Share";

interface LocationListProps {
    locations: GeoLocation[];
    title: string;
    confirmed: number;
    deaths: number;
    recovered: number;
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

export const LocationList = (props: LocationListProps) => {
    let deathRate = props.confirmed > 0 && props.deaths > 0 ? props.deaths / props.confirmed : null;
    let recoveryRate = props.confirmed > 0 && props.recovered > 0 ? props.recovered / props.confirmed : null;

    let active = props.confirmed > 0 ? props.confirmed - (props.deaths + props.recovered) : null;
    let activePercentage = active ? active / props.confirmed : null;
    const sort = (sortType: string) => {
        console.log("Sort", sortType);
    };
    return (
        <div className="card">
            <div className="card-header">{props.title}</div>
            <div className="card-body">
                <dl>
                    <dt>Confirmed</dt>
                    <dd>{props.confirmed.toLocaleString("sv-se")}</dd>

                    <dt>Deaths</dt>
                    <dd>
                        {props.deaths.toLocaleString("sv-se")} <small>{relativeToPercentage(deathRate)}</small>
                    </dd>

                    <dt>Recovered</dt>
                    <dd>
                        {props.recovered.toLocaleString("sv-se")} <small>{relativeToPercentage(recoveryRate)}</small>
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
                        {props.locations.map((item: GeoLocation) => (
                            <LocationListItem item={item} />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <td>{props.confirmed}</td>
                            <td>{props.deaths}</td>
                            <td>{props.recovered}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};
