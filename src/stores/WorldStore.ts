import { action, observable } from "mobx";
import { DataClient } from "../clients/DataClient";
import { relativeToPercentage } from "../core/functions";

export class WorldStore {
    @observable confirmed: number = 0;
    @observable deaths: number = 0;
    @observable recovered: number = 0;
    @observable active: number = 0;
    @observable deathRate: number = 0;
    @observable recoveryRate: number = 0;
    @observable activityRate: number = 0;
    @observable date: string = "";
    private client: DataClient;

    constructor() {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.loadWorldData();
    }

    @action
    async loadWorldData() {
        const response = await this.client.getJSON("/api/corona/world");
        this.confirmed = response.confirmed;
        this.deaths = response.deaths;
        this.recovered = response.recovered;
        this.active = response.active;
        this.date = response.updated;

        this.deathRate = response.deaths / response.confirmed;
        this.recoveryRate = response.recovered / response.confirmed;
        this.activityRate = response.active / response.confirmed;
    }
}
