import { action, computed, observable, toJS } from "mobx";
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
    country_id: any;
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

export interface TypeCollection {
    labels: string[];
    data: number[];
    name?: string;
}

interface CountryMetadata {
    abbr?: string;
    capital?: string;
    continent?: string;
    government?: string;
    flag?: string;
    life_expectancy?: string;
    population?: string;
    population_density?: string;
    region?: string;
    religion?: string;
    average_temp?: string;
}

export class DataStore {
    @observable loading = false;
    @observable labels = [];
    @observable renderType = "linear";
    @observable barType = "normal";
    @observable data: GeoOverview | null = null;
    @observable metadata: CountryMetadata = {};
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
    reset() {
        const defaultCases = {
            data: [],
            labels: []
        };
        this.data = null;
        this.metadata = {};
        this.labels = [];
        this.confirmed = defaultCases;
        this.deaths = defaultCases;
        this.recovered = defaultCases;
        this.provinces = [];
    }

    @action
    async loadCountry(countryId: number) {
        this.loading = true;
        this.reset();
        this.data = await this.client.getJSON(`/api/corona/geo/${countryId}`);
        await this.loadConfirmed(countryId);
        await this.loadDeaths(countryId);
        await this.loadRecovered(countryId);
        await this.loadProvinces(countryId);

        if (this.data && this.data.geo) {
            const { country_id } = this.data.geo;
            await this.loadCountryMetaData(country_id);
        }

        this.loading = false;
    }

    @action
    async loadCountryMetaData(countryId: any) {
        countryId = parseInt(countryId);
        const json = await this.client.getJSON(`/api/corona/country/${countryId}/metadata`);
        const { metadata } = json;
        this.metadata = metadata;
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
            data,
            name: "Confirmed"
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
            data,
            name: "Deaths"
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
            data,
            name: "Recovered"
        };
    }

    @action
    setRenderType(renderType: string) {
        this.renderType = renderType;
    }

    @action
    setBarChartType(barType: string) {
        this.barType = barType;
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
