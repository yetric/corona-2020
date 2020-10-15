import { DataClient } from "../clients/DataClient";
import { action, makeObservable, observable } from "mobx";

const countryCache: any = {};

export class CountryStore {
    @observable confirmed: string = "";
    @observable deaths: string = "";
    @observable recovered: string = "";
    private client: DataClient;
    private readonly id: number;
    constructor(id: number) {
        makeObservable(this);
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.id = id;
        (async () => {
            await this.loadCountry();
        })();
    }

    @action
    async loadCountry() {
        const url = `/geo/${this.id}`;
        const data = countryCache.hasOwnProperty(url)
            ? countryCache[url]
            : await this.client.getJSON(`/geo/${this.id}`);
        this.confirmed = data.confirmed.count;
        this.deaths = data.deaths.count;
        this.recovered = data.recovered.count;
        countryCache[url] = data;
    }
}
