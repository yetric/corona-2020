import { DataClient } from "../clients/DataClient";
import { action, observable } from "mobx";

export interface ReportInterface {
    name: string;
    labels: string[];
    confirmed: number[];
    deaths: number[];
    recovered: number[];
}

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
}
