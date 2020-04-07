import { action, computed, observable } from "mobx";
import { ma } from "../core/stats";
import { DataClient } from "../clients/DataClient";
import { relativeToPercentage } from "../core/functions";

const Timespan = {
    WEEKLY: "weekly",
    ALL: "all"
};

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
    @observable period = "all";
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

    cachedConfirmed: TypeCollection = {
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
        this.labels = labels;
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

    @computed get active(): TypeCollection {
        const data = this.confirmed.data.map((item, index) => {
            return item - (this.deaths.data[index] + this.recovered.data[index]);
        });
        return {
            data,
            labels: this.labels,
            name: "Active"
        };
    }

    @computed get deathRate(): TypeCollection {
        const deathRate = this.confirmed.data.map((item, index) => {
            const deaths = this.deaths.data[index];
            return deaths === 0 ? 0 : relativeToPercentage(deaths / item, false);
        });
        return {
            data: deathRate,
            labels: this.labels,
            name: "Death Rate"
        };
    }

    @computed get recoveryRate(): TypeCollection {
        const recoveryRate = this.confirmed.data.map((item, index) => {
            const recovered = this.recovered.data[index];
            return recovered === 0 ? 0 : relativeToPercentage(recovered / item, false);
        });
        return {
            data: recoveryRate,
            labels: this.labels,
            name: "Recovery Rate"
        };
    }

    @computed get activityRate(): TypeCollection {
        const actitityRate = this.confirmed.data.map((item, index) => {
            const active = this.active.data[index];
            return active === 0 ? 0 : relativeToPercentage(active / item, false);
        });
        return {
            data: actitityRate,
            labels: this.labels,
            name: "Activity Rate"
        };
    }

    getGrowthRate(name: string, expAvg: boolean = true): TypeCollection {
        const growthRate: number[] = [];
        let last = 0;
        this.confirmed.data.forEach((item, index) => {
            let change = item - last;
            let changeRelative = change > 0 && last > 0 ? relativeToPercentage(change / last, false) : 0;
            last = item;
            growthRate.push(changeRelative);
        });

        return {
            data: expAvg ? ma(growthRate, 10) : growthRate,
            labels: this.labels,
            name
        };
    }

    @computed get growthRate(): TypeCollection {
        return this.getGrowthRate("Growth Rate (running avg - 10 days)");
    }

    @computed get growthRatePlain(): TypeCollection {
        return this.getGrowthRate("Growth Rate", false);
    }

    @computed get activeTotal() {
        return this.data?.active.count;
    }

    @computed get deathRateTotal() {
        let rate = 0;
        if (this.data?.confirmed.count && this.data?.deaths.count && this.data?.deaths.count > 0) {
            rate = this.data?.deaths.count / this.data?.confirmed.count;
        }
        return rate;
    }

    @computed get recoveryRateTotal() {
        let rate = 0;
        if (this.data?.confirmed.count && this.data?.recovered.count && this.data?.recovered.count > 0) {
            rate = this.data?.recovered.count / this.data?.confirmed.count;
        }
        return rate;
    }

    @computed get activityRateTotal() {
        if (this.activeTotal && this.data?.confirmed.count) {
            return this.activeTotal / this.data?.confirmed.count;
        }
        return 0;
    }

    @action
    setPeriod(period: string) {
        this.period = period;

        switch (period) {
            case Timespan.ALL:
                break;
            case Timespan.WEEKLY:
                let newConfirmed: TypeCollection = {
                    labels: this.confirmed.labels.slice(-7),
                    data: this.confirmed.data.slice(-7),
                    name: this.confirmed.name
                };
                this.confirmed = newConfirmed;
                break;
        }
    }
}
