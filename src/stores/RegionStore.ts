import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";
import { sortLocation } from "../core/helpers";

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
        if (regionCache.hasOwnProperty(url)) {
            this.locations = regionCache[url];
        } else {
            const payload = await this.client.getJSON(url);
            const geoLocations = payload.geos.map((item: any) => {
                return item;
            });
            this.locations = geoLocations;
            regionCache[url] = geoLocations;
        }

        let confirmed = 0;
        let deaths = 0;
        let recovered = 0;

        this.locations.forEach((value: GeoLocation) => {
            let rec = (value.recovered && value.recovered.count && parseInt(value.recovered.count)) || 0;
            recovered += rec;
            deaths += value.deaths ? parseInt(value.deaths.count) : 0;
            confirmed += value.confirmed ? parseInt(value.confirmed.count) : 0;
        });

        this.confirmed = confirmed;
        this.deaths = deaths;
        this.recovered = recovered;
        this.loading = false;
    }

    @action
    async sort(sortKey: string) {
        this.locations = sortLocation(this.locations, sortKey);
    }
}
