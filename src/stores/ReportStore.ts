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

    @computed get weekly(): ReportInterface {
        return this.sliceThatReport(-8);
    }

    @computed get biweekly(): ReportInterface {
        return this.sliceThatReport(-15);
    }

    @computed get monthly(): ReportInterface {
        return this.sliceThatReport(-31);
    }
}
