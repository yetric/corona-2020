import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";
import { sortLocation } from "../core/helpers";

let continentCache: any = {};

export class ContinentStore {
    @observable locations: GeoLocation[] = [];
    @observable testArray: any[];
    @observable confirmed: number = 0;
    @observable deaths: number = 0;
    @observable recovered: number = 0;
    @observable loading: boolean = false;
    private client: DataClient;
    private readonly continent: string;

    constructor(continentName: string) {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.continent = continentName;
        this.testArray = [1, 3, 4, 5, 6, 7, 9];
        this.locations = [];
        (async () => {
            await this.loadContinent();
        })();
    }

    @action
    async loadContinent() {
        this.loading = true;
        const url = `/api/corona/continent/${this.continent}`;
        if (continentCache.hasOwnProperty(url)) {
            this.locations = continentCache[url];
        } else {
            const payload = await this.client.getJSON(url);
            const all = payload.geos.map((item: any) => {
                return item;
            });
            this.locations = all;
            continentCache[url] = all;
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
