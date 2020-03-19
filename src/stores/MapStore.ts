import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";

const mapCache: any = {};

export class MapStore {
    private client: DataClient;
    @observable loading: boolean = false;
    @observable countryData: any[] = [];
    @observable geometry: any = null;
    @observable lat: number = 46.8182;
    @observable lng: number = 46.8182;
    @observable zoom: number = 2;
    @observable coord: any = null;

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
        this.countryData = countryData;
        this.geometry = JSON.parse(countryData.country.meta.geometry);
        console.log(countryData.country.meta.coord);
        this.coord = JSON.parse(countryData.country.meta.coord);
    }
}
