import { DataClient } from "../clients/DataClient";
import { action, computed, observable } from "mobx";
import { expMovingAverage, ma } from "../core/stats";
import { CountryMetadata } from "./DataStore";

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
        coord: null
    }
};

export class ReportStore {
    private client: DataClient;
    @observable report: ReportInterface | null = null;
    @observable metadata: CountryMetadata | null = null;

    constructor() {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
    }

    @action
    async loadReport(name: any, loadMetadata: boolean = false) {
        const response = await this.client.getJSON("/api/corona/reports/" + encodeURIComponent(name));
        this.report = response.data;
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
                population: null
            }
        };
    }

    flattenThatReport() {
        let report = this.firstDeathReport();
        return {
            recovered: expMovingAverage(report.recovered, 14),
            deaths: expMovingAverage(report.deaths, 14),
            confirmed: expMovingAverage(report.confirmed, 14),
            labels: report.labels,
            name: report.name,
            country: report.country || {
                coord: null,
                geometry: null,
                population: null
            }
        };
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
                population: null
            }
        };
    }

    @computed get firstDeath(): ReportInterface {
        return this.firstDeathReport();
    }

    @action
    private async loadMetadata(name: any) {
        let { metadata } = await this.client.getJSON(`/api/corona/report/${encodeURIComponent(name)}/metadata`);
        this.metadata = metadata;
    }
}
