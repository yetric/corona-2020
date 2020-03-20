import { GeoLocation } from "../models/GeoLocation";

export const sortLocation = (location: GeoLocation[], sortKey: string) => {
    return location.slice().sort((a: GeoLocation, b: GeoLocation) => {
        let sort = 0;
        switch (sortKey) {
            case "confirmed":
                sort = parseInt(a.confirmed.count) > parseInt(b.confirmed.count) ? -1 : 1;
                break;
            case "deaths":
                sort = parseInt(a.deaths.count) > parseInt(b.deaths.count) ? -1 : 1;
                break;
            case "recovered":
                sort = parseInt(a.recovered.count) > parseInt(b.recovered.count) ? -1 : 1;
                break;
            case "country":
                sort = a.country > b.country ? 1 : -1;
                break;
        }
        return sort;
    });
};
