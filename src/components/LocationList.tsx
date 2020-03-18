import React from "react";
import { GeoLocation } from "../models/GeoLocation";
import { Link } from "react-router-dom";
import "./LocationList.css";

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
    return (
        <div className="card">
            <div className="card-header">{props.title}</div>
            <div className="card-body">
                <dl>
                    <dt>Confirmed</dt>
                    <dd>
                        {props.confirmed} <small>dsf</small>
                    </dd>

                    <dt>Deaths</dt>
                    <dd>
                        {props.deaths} <small>dsf</small>
                    </dd>

                    <dt>Recovered</dt>
                    <dd>
                        {props.recovered} <small>dsf</small>
                    </dd>
                </dl>
            </div>
            <div className="table-responsive">
                <table className={"location-list"}>
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Confirmed</th>
                            <th>Deaths</th>
                            <th>Recovered</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.locations.map((item: GeoLocation) => (
                            <LocationListItem item={item} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
