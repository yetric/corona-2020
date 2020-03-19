import React from "react";

import { GeoJSON, Map, TileLayer } from "react-leaflet";

interface CoronaMapProps {
    lat: number;
    lng: number;
    zoom: number;
    geoJSON?: any;
}

export const CoronaMap = ({ lat, lng, zoom, geoJSON }: CoronaMapProps) => {
    return (
        <Map
            style={{
                width: "100%",
                height: "100%"
            }}
            viewport={{
                center: [lat, lng],
                zoom
            }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {geoJSON && <GeoJSON key={JSON.stringify(geoJSON)} data={geoJSON} />}
        </Map>
    );
};
