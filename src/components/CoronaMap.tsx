import React from "react";

import { GeoJSON, Map, TileLayer } from "react-leaflet";
import { LatLng, LatLngBounds } from "leaflet";

interface CoronaMapProps {
    lat: number;
    lng: number;
    zoom: number;
    geoJSON?: any;
    coord?: any;
}

export const CoronaMap = ({ lat, lng, zoom, geoJSON, coord }: CoronaMapProps) => {
    return (
        <Map
            style={{
                width: "100%",
                height: "100%"
            }}
            bounds={coord && new LatLngBounds(new LatLng(coord.north, coord.west), new LatLng(coord.south, coord.east))}
            boundsOptions={{ padding: [10, 10] }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {geoJSON && (
                <GeoJSON
                    key={JSON.stringify(geoJSON)}
                    data={geoJSON}
                    style={(feature) => {
                        return {
                            fillColor: "rgb(208, 135, 112)",
                            weight: 0.3,
                            opacity: 1,
                            fillOpacity: 0.4
                        };
                    }}
                />
            )}
        </Map>
    );
};
