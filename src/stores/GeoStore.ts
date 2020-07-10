import { DataClient } from "../clients/DataClient";
import { action, observable } from "mobx";

class GeoStore {
    @observable nearby: any[] = [];
    private client: DataClient;
    constructor() {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
    }

    @action
    async getNearby(id: number) {
        const nearby = await this.client.getJSON(`/country/${id}/nearby`);
        this.nearby = nearby.nearby;
    }
}

export const geoStore = new GeoStore();
