import { action, makeObservable, observable } from "mobx";
import { DataClient } from "../clients/DataClient";

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
    @observable confirmedCompare: any = null;
    @observable deathsCompared: any = null;
    @observable recoveredCompared: any = null;
    @observable activeCompared: any = null;

    constructor() {
        makeObservable(this);
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.loadWorldData().catch((e) => {
            console.error(e);
        });
    }

    @action
    async loadWorldData() {
        const response = await this.client.getJSON("/world");
        this.confirmed = response.confirmed;
        this.deaths = response.deaths;
        this.recovered = response.recovered;
        this.active = response.active;
        this.date = response.updated;
        this.confirmedCompare = (response.confirmed - response.confirmed_compare) / response.confirmed_compare;
        this.deathsCompared = (response.deaths - response.deaths_compare) / response.deaths_compare;
        this.recoveredCompared = (response.recovered - response.recovered_compare) / response.recovered_compare;
        this.activeCompared = (response.active - response.active_compare) / response.active_compare;

        this.deathRate = response.deaths / response.confirmed;
        this.recoveryRate = response.recovered / response.confirmed;
        this.activityRate = response.active / response.confirmed;
    }
}
