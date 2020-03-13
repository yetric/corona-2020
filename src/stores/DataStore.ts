import {action, computed, observable} from "mobx";
import {ma} from "../core/stats";
import { DataClient } from "../clients/DataClient";

interface Case {
    count: string;
    date: number;
}

interface Country {
    name: string;
    cases: Case[];
}

interface GeoLocation {
    province: string;
    country: string;
    lat: string;
    lng: string;
}

interface TypeCurrent {
    date: string;
    count: any;
}

interface GeoOverview {
    geo: GeoLocation;
    confirmed: TypeCurrent;
    deaths: TypeCurrent;
    recovered: TypeCurrent;
}

interface TypeCollection {
    labels: string[];
    data: number[];
}

export class DataStore {
    @observable labels = [];
    @observable renderType = "linear";
    @observable data: GeoOverview | null = null;
    @observable confirmed: TypeCollection = {
        data: [],
        labels: []
    };
    @observable deaths = [];
    @observable recovered = [];
    private client: DataClient;


    constructor() {
        this.client = new DataClient("https://yetric.se/");
    }

    @action
    async loadCountry(countryId: number) {
        this.data = await this.client.getJSON(`/api/corona/geo/${countryId}`);
        await this.loadConfirmed(countryId);
    }

    @action
    async loadConfirmed(countryId: number) {
        const json = await this.client.getJSON(`/api/corona/geo/${countryId}/confirmed`);
        const {confirmed} = json;
        let labels = confirmed.map((item: Case) => {
            return item.date;
        });

        let data = confirmed.map((item: Case) => {
            return parseInt(item.count);
        });
        this.confirmed = {
            labels,
            data
        };
    }

    @action
    async loadDeaths(countryId: number) {
        this.deaths = await this.client.getJSON(`/api/corona/geo/${countryId}/deaths`);
    }

    @action
    async loadRecovered(countryId: number) {
        this.recovered = await this.client.getJSON(`/api/corona/geo/${countryId}/recovered`);
    }

    @action
    setRenderType(renderType: string) {
        this.renderType = renderType;
    }

    @computed get movingAvg() {
        return ma(this.confirmed.data, 3);
    }

}
