import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { geoStore } from "../stores/GeoStore";
import { withRouter } from "react-router-dom";

const NearbyObserver = observer(({ id, history }: any) => {
    useEffect(() => {
        geoStore
            .getNearby(id)
            .then(() => {})
            .catch(() => {});
    }, [id]);

    const navigate = (event: any) => {
        const countryId = event.target.value;
        if (countryId > 0) {
            history.push("/" + event.target.value);
        }
    };

    return (
        <select onChange={navigate}>
            <option value={-1}>Nearby Countries</option>
            {geoStore.nearby.map((near: any) => {
                const province =
                    near.province && near.province.length > 0 && near.province !== near.country
                        ? near.province + ", "
                        : null;
                return (
                    <option value={near.id} key={"nearby-" + near.id}>
                        {province}
                        {near.country}
                    </option>
                );
            })}
        </select>
    );
});

export const Nearby = withRouter(NearbyObserver);
