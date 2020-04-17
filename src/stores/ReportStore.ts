import { DataClient } from "../clients/DataClient";
import { action, computed, observable } from "mobx";
import { ma } from "../core/stats";

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

    constructor() {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
    }

    @action
    async loadReport(name: any) {
        const response = await this.client.getJSON("/api/corona/reports/" + encodeURIComponent(name));
        this.report = response.data;
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
        if (!this.report) return emptyReport;
        return {
            recovered: ma(this.report.recovered, 14),
            deaths: ma(this.report.deaths, 14),
            confirmed: ma(this.report.confirmed, 14),
            labels: this.report.labels,
            name: this.report.name,
            country: this.report.country || {
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
}
