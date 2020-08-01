import { DataClient } from "../clients/DataClient";
import { action, computed, observable } from "mobx";
import { expMovingAverage } from "../core/stats";
import { CountryMetadata } from "./DataStore";

const MOVING_AVG_DAYS = 14;

export interface CountryMetaDataInterface {
    population?: number;
    coord?: any;
    geometry?: any;
}

export interface ReportInterface {
    name: string;
    labels: string[];
    confirmed: number[];
    deaths: number[];
    recovered: number[];
    country: CountryMetaDataInterface;
}

const emptyReport = {
    recovered: [],
    deaths: [],
    confirmed: [],
    labels: [],
    name: "",
    country: {
        population: 0,
        geometry: null,
        coord: null,
    },
};

export interface GeoOverview {
    active: number;
    confirmed: number;
    deaths: number;
    recovered: number;
    deathRate: number;
    recoveryRate: number;
    activityRate: number;
}

export interface GeoCollection {
    [name: string]: GeoOverview;
}

interface ReportCacheInterface {
    [key: string]: ReportInterface;
}

interface MetadataCacheInterface {
    [key: string]: CountryMetadata;
}

const reportCache: ReportCacheInterface = {};
const metaCache: MetadataCacheInterface = {};

export class ReportStore {
    private client: DataClient;
    @observable report: ReportInterface | null = null;
    @observable metadata: CountryMetadata | null = null;
    @observable collection: GeoCollection | null = null;

    constructor() {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
    }

    @action
    async loadReport(name: any, loadMetadata: boolean = false) {
        if (reportCache.hasOwnProperty(name)) {
            this.report = reportCache[name];
        } else {
            const response = await this.client.getJSON("/reports/" + encodeURIComponent(name));
            this.report = response.data;
            reportCache[name] = response.data;
        }

        if (loadMetadata) {
            await this.loadMetadata(name);
        }
    }

    sliceThatReport(slice: number) {
        if (!this.report) return emptyReport;
        return {
            recovered: this.report?.recovered.slice(slice) || [],
            deaths: this.report?.deaths.slice(slice) || [],
            confirmed: this.report?.confirmed.slice(slice) || [],
            labels: this.report?.labels.slice(slice) || [],
            name: this.report?.name || "",
            country: this.report.country || {
                coord: null,
                geometry: null,
                population: null,
            },
        };
    }

    flattenThatReport() {
        let report = this.firstDeathReport();
        return {
            recovered: expMovingAverage(report.recovered, MOVING_AVG_DAYS),
            deaths: expMovingAverage(report.deaths, MOVING_AVG_DAYS),
            confirmed: expMovingAverage(report.confirmed, MOVING_AVG_DAYS),
            labels: report.labels,
            name: report.name,
            country: report.country || {
                coord: null,
                geometry: null,
                population: null,
            },
        };
    }

    @computed get daysSinceFirstDeath(): number {
        if (!this.report) return 0;
        return this.report?.deaths.length - this.daysToFirstDeath();
    }

    @computed get weekly(): ReportInterface {
        return this.sliceThatReport(-8);
    }

    @computed get biweekly(): ReportInterface {
        return this.sliceThatReport(-15);
    }

    @computed get monthly(): ReportInterface {
        return this.sliceThatReport(-31);
    }

    @computed get flatten(): ReportInterface {
        return this.flattenThatReport();
    }

    public daysToFirstDeath(): number {
        if (!this.report) return 0;
        for (let i = 0; i < this.report.deaths.length; i++) {
            if (this.report.deaths[i] > 0) {
                return i;
            }
        }
        return 0;
    }

    private firstDeathReport(): ReportInterface {
        if (!this.report) return emptyReport;

        let deathIndex = this.daysToFirstDeath();
        let recovered = [...this.report.recovered].splice(deathIndex);
        let deaths = [...this.report.deaths].splice(deathIndex);
        let confirmed = [...this.report.confirmed].splice(deathIndex);
        let labels = [...this.report.labels].splice(deathIndex);
        return {
            recovered,
            deaths,
            confirmed,
            labels,
            name: this.report.name,
            country: this.report.country || {
                coord: null,
                geometry: null,
                population: null,
            },
        };
    }

    @computed get firstDeath(): ReportInterface {
        return this.firstDeathReport();
    }

    @computed get peakConfirmed(): string {
        let confirmedDaily = this.toDaily(this.report?.confirmed);
        const indexOfMaxValue = confirmedDaily.indexOf(Math.max(...confirmedDaily));
        return this.report ? this.report.labels[indexOfMaxValue] : "";
    }

    @computed get peakDeaths(): string {
        let deathsDaily = this.toDaily(this.report?.deaths);
        const indexOfMaxValue = deathsDaily.indexOf(Math.max(...deathsDaily));
        return this.report ? this.report.labels[indexOfMaxValue] : "";
    }

    private toDaily(collection: number[] | undefined) {
        if (collection) {
            return collection.map((count, index) => {
                return collection[index - 1] ? count - collection[index - 1] : count;
            });
        }
        return [];
    }

    @action
    private async loadMetadata(name: any) {
        if (metaCache.hasOwnProperty(name)) {
            this.metadata = metaCache[name];
        } else {
            let { metadata } = await this.client.getJSON(`/report/${encodeURIComponent(name)}/metadata`);
            this.metadata = metadata;
            metaCache[name] = metadata;
        }
    }

    addRates(geo: any): GeoCollection {
        for (const geoKey in geo) {
            if (geo.hasOwnProperty(geoKey)) {
                let item: GeoOverview = geo[geoKey];
                item.activityRate = item.active / item.confirmed;
                item.recoveryRate = item.recovered / item.confirmed;
                item.deathRate = item.deaths / item.confirmed;
            }
        }
        return geo;
    }

    @action
    async loadContinent(continent: string) {
        let { geos } = await this.client.getJSON("/continent/" + continent);
        this.collection = this.addRates(geos);
        this.sortBy("country");
    }

    @action
    async loadRegion(region: string) {
        let { geos } = await this.client.getJSON("/region/" + region);
        this.collection = this.addRates(geos);
        this.sortBy("country");
    }

    @action
    sortBy(sort: string) {
        if (!this.collection) return;
        const ordered: GeoCollection = {};
        if (sort === "country") {
            Object.keys(this.collection)
                .sort()
                .forEach((key) => {
                    if (this.collection) {
                        ordered[key] = this.collection[key];
                    }
                });
            this.collection = ordered;
        }

        if (
            sort === "deaths" ||
            sort === "confirmed" ||
            sort === "recovered" ||
            sort === "active" ||
            sort === "deathRate" ||
            sort === "recoveryRate" ||
            sort === "activityRate"
        ) {
            let countries = Object.keys(this.collection);
            countries.sort((a: string, b: string) => {
                if (!this.collection) return 0;
                return this.collection[b][sort] - this.collection[a][sort];
            });
            countries.forEach((key) => {
                if (this.collection) {
                    ordered[key] = this.collection[key];
                }
            });
            this.collection = ordered;
        }
    }
}
