import React from "react";

import { GeoJSON, Map, TileLayer } from "react-leaflet";
import { LatLng, LatLngBounds } from "leaflet";

interface CountryMapProps {
    geoJSON?: any;
    coord?: any;
}

export const CountryMap = ({ geoJSON, coord }: CountryMapProps) => {
    return (
        <div className="map-holder">
            <Map
                bounds={
                    coord && new LatLngBounds(new LatLng(coord.north, coord.west), new LatLng(coord.south, coord.east))
                }
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
                                fillColor: "#AE81FF",
                                weight: 1,
                                opacity: 0.5,
                                fillOpacity: 0.25
                            };
                        }}
                    />
                )}
            </Map>
        </div>
    );
};
