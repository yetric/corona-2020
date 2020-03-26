import { action, computed, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";
import { sortLocation } from "../core/helpers";

let continentCache: any = {};

export class ContinentStore {
    @observable locations: GeoLocation[] = [];
    @observable confirmed: number = 0;
    @observable deaths: number = 0;
    @observable recovered: number = 0;
    @observable loading: boolean = false;
    private client: DataClient;
    private readonly continent: string;

    constructor(continentName: string) {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.continent = continentName;
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
            let rec = (value.recovered && value.recovered.count && parseInt(value.recovered.count)) || 0;
            recovered += rec;
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

    @computed get deathTotal() {
        let total = 0;
        this.locations.forEach((a: GeoLocation) => {
            total += parseInt(a.deaths.count);
        });

        return total;
    }

    @computed get confirmedTotal() {
        let total = 0;
        this.locations.forEach((a: GeoLocation) => {
            total += parseInt(a.confirmed.count);
        });

        return total;
    }

    @computed get recoveredTotal() {
        let total = 0;
        this.locations.forEach((a: GeoLocation) => {
            let count = (a.recovered && a.recovered.count && parseInt(a.recovered.count)) || 0;
            total += count;
        });

        return total;
    }

    @computed get activeTotal() {
        return this.confirmedTotal - (this.deathTotal + this.recoveredTotal);
    }
}
