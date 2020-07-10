import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";
import { cacheOrGet, sortLocation } from "../core/helpers";

const expectancyCache: any = {};

export class ExpectancyStore {
    @observable locations: GeoLocation[] = [];
    @observable confirmed: number = 0;
    @observable deaths: number = 0;
    @observable recovered: number = 0;
    @observable loading: boolean = false;
    private client: DataClient;
    private readonly lifeExpectancy: number;

    constructor(lifeExpectancy: number) {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.lifeExpectancy = lifeExpectancy;
        (async () => {
            await this.loadRegion();
        })();
    }

    @action
    async loadRegion() {
        this.loading = true;
        const url = `/expectancy/${Math.round(this.lifeExpectancy)}`;
        let { locations, confirmed, deaths, recovered } = await cacheOrGet(url, this.client, expectancyCache);
        this.confirmed = confirmed;
        this.deaths = deaths;
        this.recovered = recovered;
        this.locations = locations;
        this.loading = false;
    }

    @action
    async sort(sortKey: string) {
        this.locations = sortLocation(this.locations, sortKey);
    }
}
