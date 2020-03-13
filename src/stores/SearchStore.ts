import { DataClient } from "../clients/DataClient";
import { action, observable } from "mobx";

export class SearchStore {
    private client: DataClient;
    private searchCallback: any;
    private query: string;

    @observable result = [];

    constructor() {
        this.query = "";
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
    }

    @action
    async search(value: string) {
        this.query = value;
        await this.apiSearch();
    }

    @action
    clear() {
        this.result = [];
        this.query = "";
    }

    @action
    async apiSearch() {
        if (this.query.length > 0) {
            let response = await this.client.getJSON(`/api/corona/geo?query=${this.query}`);
            this.result = response.geos;
        }
    }
}