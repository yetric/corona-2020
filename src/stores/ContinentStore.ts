import { action, computed, makeObservable, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";
import { cacheOrGet, sortLocation } from "../core/helpers";

let continentCache: any = {};

export class ContinentStore {
    @observable locations: GeoLocation[] = [];
    @observable confirmed: number = 0;
    @observable deaths: number = 0;
    @observable recovered: number = 0;
    @observable loading: boolean = false;
    private readonly client: DataClient;
    private readonly continent: string;

    constructor(continentName: string) {
        makeObservable(this);
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
        const url = `/continent/${this.continent}`;
        const calculated = await cacheOrGet(url, this.client, continentCache);
        this.confirmed = calculated.confirmed;
        this.deaths = calculated.deaths;
        this.recovered = calculated.recovered;
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
