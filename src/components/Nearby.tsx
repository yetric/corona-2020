import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { geoStore } from "../stores/GeoStore";
import { Link } from "react-router-dom";

interface NearbyProps {
    id: number;
}

export const Nearby = observer(({ id }: NearbyProps) => {
    useEffect(() => {
        geoStore
            .getNearby(id)
            .then(() => {})
            .catch(() => {});
    }, [id]);

    const getList = () => {
        return (
            <ul className={"list-group"}>
                <li className={"list-header"}>
                    Countries near-by <small>(Country center)</small>
                </li>
                {geoStore.nearby.map((near: any) => {
                    return (
                        <li key={"nearby-" + near.id}>
                            <Link to={"/" + near.id}>
                                {near.country}
                                {near.province.length > 0 && near.province !== near.country && (
                                    <small> {near.province}</small>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return geoStore.nearby.length > 0 ? getList() : null;
});
