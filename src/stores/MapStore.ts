import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";

const mapCache: any = {};

export class MapStore {
    private client: DataClient;
    @observable loading: boolean = false;
    @observable countryData: any[] = [];
    @observable geometry: any = null;

    constructor() {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
    }

    @action
    async load(id: number) {
        this.loading = true;
        const countryData = mapCache.hasOwnProperty(id)
            ? mapCache[id]
            : await this.client.getJSON(`/api/corona/world/${id}`);
        mapCache[id] = countryData;
        this.loading = false;
        console.log(countryData);
        this.countryData = countryData;
        this.geometry = JSON.parse(countryData.country.meta.geometry);
    }
}
