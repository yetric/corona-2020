import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";

const regionCache: any = {};

export class RegionStore {
    @observable locations: GeoLocation[] = [];
    @observable confirmed: number = 0;
    @observable deaths: number = 0;
    @observable recovered: number = 0;
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
            recovered += parseInt(value.recovered.count);
            deaths += parseInt(value.deaths.count);
            confirmed += parseInt(value.confirmed.count);
        });

        this.confirmed = confirmed;
        this.deaths = deaths;
        this.recovered = recovered;
    }
}
