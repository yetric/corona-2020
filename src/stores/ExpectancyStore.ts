import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";
import { sortLocation } from "../core/helpers";

const governmentCache: any = {};

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
        const url = `/api/corona/expectancy/${Math.round(this.lifeExpectancy)}`;
        if (governmentCache.hasOwnProperty(url)) {
            this.locations = governmentCache[url];
        } else {
            const payload = await this.client.getJSON(url);
            const geoLocations = payload.geos.map((item: any) => {
                return item;
            });
            this.locations = geoLocations;
            governmentCache[url] = geoLocations;
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
        this.loading = false;
    }

    @action
    async sort(sortKey: string) {
        this.locations = sortLocation(this.locations, sortKey);
    }
}
