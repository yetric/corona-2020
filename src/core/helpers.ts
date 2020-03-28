import { GeoLocation } from "../models/GeoLocation";
import { colors } from "./colors";

export const sortLocation = (location: GeoLocation[], sortKey: string) => {
    return location.slice().sort((a: GeoLocation, b: GeoLocation) => {
        const activeA = parseInt(a.confirmed.count) - (parseInt(a.deaths.count) + parseInt(a.recovered.count));
        const activeB = parseInt(b.confirmed.count) - (parseInt(b.deaths.count) + parseInt(b.recovered.count));

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
            case "active":
                sort = activeA > activeB ? -1 : 1;
                break;
        }
        return sort;
    });
};

export interface DatasetProps {
    label: string;
    data: number[];
    color: string;
}

export const createDataset = ({ label, data, color }: DatasetProps) => {
    return {
        fill: false,
        lineTension: 0,
        label,
        data,
        backgroundColor: color,
        borderColor: color,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: color,
        pointBackgroundColor: color,
        pointBorderWidth: 1,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 1,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
        datasetKeyProvider: label
    };
};
