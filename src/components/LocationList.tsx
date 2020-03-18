import React from "react";
import { GeoLocation } from "../models/GeoLocation";
import { Link } from "react-router-dom";
import "./LocationList.css";

interface LocationListProps {
    locations: GeoLocation[];
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
        <td className={"confirmed text-right"}>{item.confirmed.count}</td>
        <td className={"deaths text-right"}>{item.deaths.count}</td>
        <td className={"recovered text-right"}>{item.recovered.count}</td>
    </tr>
);

export const LocationList = (props: LocationListProps) => {
    return (
        <div className="card">
            <div className="card-header">{props.title}</div>

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
