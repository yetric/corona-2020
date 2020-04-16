import { DataClient } from "../clients/DataClient";
import { action, computed, observable } from "mobx";

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

    @computed get weekly(): ReportInterface {
        if (!this.report) return emptyReport;
        return {
            recovered: this.report?.recovered.slice(-7) || [],
            deaths: this.report?.deaths.slice(-7) || [],
            confirmed: this.report?.confirmed.slice(-7) || [],
            labels: this.report?.labels.slice(-7) || [],
            name: this.report?.name || "",
            country: this.report.country || {
                coord: null,
                geometry: null,
                population: null
            }
        };
    }

    @computed get monthly(): ReportInterface {
        if (!this.report) return emptyReport;
        return {
            recovered: this.report?.recovered.slice(-30) || [],
            deaths: this.report?.deaths.slice(-30) || [],
            confirmed: this.report?.confirmed.slice(-30) || [],
            labels: this.report?.labels.slice(-30) || [],
            name: this.report?.name || "",
            country: this.report.country || {
                coord: null,
                geometry: null,
                population: null
            }
        };
    }
}
