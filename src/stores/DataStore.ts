import { action, computed, observable } from "mobx";
import { ma } from "../core/stats";
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
    active: {
        count: number;
        percentage: number;
        deathRate: number;
        recoveryRate: number;
    };
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
    @observable deaths: TypeCollection = {
        data: [],
        labels: []
    };
    @observable recovered: TypeCollection = {
        data: [],
        labels: []
    };
    @observable provinces: any[] = [];
    private client: DataClient;

    constructor() {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
    }

    @action
    async loadCountry(countryId: number) {
        this.data = await this.client.getJSON(`/api/corona/geo/${countryId}`);
        await this.loadConfirmed(countryId);
        await this.loadDeaths(countryId);
        await this.loadRecovered(countryId);
        await this.loadProvinces(countryId);
    }

    @action
    async loadConfirmed(countryId: number) {
        const json = await this.client.getJSON(`/api/corona/geo/${countryId}/confirmed`);
        const { confirmed } = json;
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
        const json = await this.client.getJSON(`/api/corona/geo/${countryId}/deaths`);
        const { deaths } = json;
        let labels = deaths.map((item: Case) => {
            return item.date;
        });

        let data = deaths.map((item: Case) => {
            return parseInt(item.count);
        });
        this.deaths = {
            labels,
            data
        };
    }

    @action
    async loadRecovered(countryId: number) {
        const json = await this.client.getJSON(`/api/corona/geo/${countryId}/recovered`);
        const { recovered } = json;
        let labels = recovered.map((item: Case) => {
            return item.date;
        });

        let data = recovered.map((item: Case) => {
            return parseInt(item.count);
        });
        this.recovered = {
            labels,
            data
        };
    }

    @action
    setRenderType(renderType: string) {
        this.renderType = renderType;
    }

    @computed get movingAvg() {
        return ma(this.confirmed.data, 3);
    }

    @action
    async loadProvinces(geoId: number) {
        let response = await this.client.getJSON(`/api/corona/country/${geoId}`);
        this.provinces = response.country;
    }
}
