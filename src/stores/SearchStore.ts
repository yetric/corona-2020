import { DataClient } from "../clients/DataClient";
import { action, observable } from "mobx";

interface SearchResult {
    countries: any[];
    regions: any[];
    continents: any[];
}

export class SearchStore {
    private client: DataClient;
    private query: string;

    @observable result: SearchResult = {
        continents: [],
        countries: [],
        regions: []
    };

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
        this.result = {
            continents: [],
            countries: [],
            regions: []
        };
        this.query = "";
    }

    @action
    async apiSearch() {
        if (this.query.length > 1) {
            this.result = await this.client.getJSON(`/api/corona/country?query=${this.query}`);
        }
    }
}
