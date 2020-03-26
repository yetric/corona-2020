import { observable } from "mobx";
import { DataClient } from "../clients/DataClient";

type LocationType = "country" | "region" | "continent" | "geo";

export interface CurrentProps {
    confirmed: number;
    deaths: number;
    recovered: number;
    active: number;
    date: string;
}

export interface CurrentRatesProps {
    death: number;
    recovered: number;
    active: number;
}

export interface DataProps {
    confirmed: number[];
    deaths: number[];
    recovered: number[];
    active: number[];
    labels: string[];
}

export interface GrowthProps {
    confirmed: number[];
    death: number[];
    recovered: number[];
    active: number[];
}

export class LocationStore {
    @observable current: CurrentProps = {
        confirmed: 0,
        deaths: 0,
        recovered: 0,
        active: 0,
        date: ""
    };

    @observable compare: CurrentProps = {
        confirmed: 0,
        deaths: 0,
        recovered: 0,
        active: 0,
        date: ""
    };

    @observable rates: CurrentRatesProps = {
        active: 0,
        death: 0,
        recovered: 0
    };

    @observable data: DataProps = {
        active: [],
        confirmed: [],
        deaths: [],
        labels: [],
        recovered: []
    };

    @observable growth: GrowthProps = {
        active: [],
        confirmed: [],
        death: [],
        recovered: []
    };

    private client: DataClient;

    constructor() {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
    }

    private async loadData(locationType: LocationType, id: number, params: any = {}) {
        switch (locationType) {
            case "continent":
                break;
            case "country":
                break;
            case "geo":
                break;
            case "region":
                break;
        }
    }
}
