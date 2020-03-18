import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { GeoLocation } from "../models/GeoLocation";

const continentCache: any = {};

export class ContinentStore {
    @observable locations: GeoLocation[] = [];
    private client: DataClient;
    private readonly continent: string;

    constructor(continentName: string) {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.continent = continentName;
        (async () => {
            await this.loadContinent();
        })();
    }

    @action
    async loadContinent() {
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
    }
}
