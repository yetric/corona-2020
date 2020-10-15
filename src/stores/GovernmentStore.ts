import { action, makeObservable, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";
import { cacheOrGet, sortLocation } from "../core/helpers";

const governmentCache: any = {};

export class GovernmentStore {
    @observable locations: GeoLocation[] = [];
    @observable confirmed: number = 0;
    @observable deaths: number = 0;
    @observable recovered: number = 0;
    @observable loading: boolean = false;
    private readonly client: DataClient;
    private readonly governmentType: string;

    constructor(governmentType: string) {
        makeObservable(this);
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.governmentType = governmentType;
        (async () => {
            await this.loadRegion();
        })();
    }

    @action
    async loadRegion() {
        this.loading = true;
        const url = `/government/${this.governmentType}`;
        let { locations, confirmed, deaths, recovered } = await cacheOrGet(url, this.client, governmentCache);
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
