import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";
import { cacheOrGet, sortLocation } from "../core/helpers";

const regionCache: any = {};

export class RegionStore {
    @observable locations: GeoLocation[] = [];
    @observable confirmed: number = 0;
    @observable deaths: number = 0;
    @observable recovered: number = 0;
    @observable loading: boolean = false;
    private client: DataClient;
    private readonly region: string;

    constructor(regionName: string) {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.region = regionName;
        (async () => {
            await this.loadRegion();
        })();
    }

    @action
    async loadRegion() {
        this.loading = true;
        const url = `/region/${this.region}`;
        const calculated = await cacheOrGet(url, this.client, regionCache);
        this.confirmed = calculated.confirmed;
        this.deaths = calculated.deaths;
        this.recovered = calculated.recovered;
        this.loading = false;
    }

    @action
    async sort(sortKey: string) {
        this.locations = sortLocation(this.locations, sortKey);
    }
}
