import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";

const regionCache: any = {};

export class RegionStore {
    @observable locations: GeoLocation[] = [];
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
        const url = `/api/corona/region/${this.region}`;
        if (regionCache.hasOwnProperty(url)) {
            this.locations = regionCache[url];
        } else {
            const payload = await this.client.getJSON(url);
            const all = payload.geos.map((item: any) => {
                return item;
            });
            this.locations = all;
            regionCache[url] = all;
        }
    }
}
