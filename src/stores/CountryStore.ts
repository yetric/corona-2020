import { DataClient } from "../clients/DataClient";
import { action, observable } from "mobx";

const countryCache: any = {};

export class CountryStore {
    @observable confirmed: string = "";
    @observable deaths: string = "";
    @observable recovered: string = "";
    @observable data: any = null;
    private client: DataClient;
    private readonly id: number;
    constructor(id: number) {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.id = id;
        (async () => {
            await this.loadCountry();
        })();
    }

    @action
    async loadCountry() {
        const url = `/api/corona/geo/${this.id}`;
        const data = countryCache.hasOwnProperty(url)
            ? countryCache[url]
            : await this.client.getJSON(`/api/corona/geo/${this.id}`);
        this.confirmed = data.confirmed.count;
        this.deaths = data.deaths.count;
        this.recovered = data.recovered.count;
        countryCache[url] = data;
        this.data = data;
    }
}
