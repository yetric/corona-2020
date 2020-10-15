import { DataClient } from "../clients/DataClient";
import { action, makeObservable, observable } from "mobx";

interface SearchResult {
    countries: any[];
    regions: any[];
    continents: any[];
}

export class SearchStore {
    private client: DataClient;
    private query: string;

    private lookup: any = {
        usa: "US",
        kina: "China",
        ryssland: "Russia",
        sverige: "Sweden",
        tyskland: "Germany",
        england: "United Kingdom",
        uk: "United Kingdom",
        frankrike: "France",
        norge: "Norway",
        danmark: "Denmark",
        island: "Iceland",
        suomi: "Finland",
    };

    @observable result: SearchResult = {
        continents: [],
        countries: [],
        regions: [],
    };

    constructor() {
        makeObservable(this);
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
            regions: [],
        };
        this.query = "";
    }

    @action
    async apiSearch() {
        if (this.query.length > 1) {
            let query = this.lookup[this.query.toLowerCase()] || this.query;
            this.result = await this.client.getJSON(`/country?query=${query}`);
        }
    }
}
