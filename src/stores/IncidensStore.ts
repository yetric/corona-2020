import { DataClient } from "../clients/DataClient";
import { action, computed, observable } from "mobx";

interface CountryIncidens {
    name: string;
    count: number;
}

export class IncidensStore {
    private client: DataClient;

    @observable deaths: CountryIncidens[] = [];
    @observable confirmed: CountryIncidens[] = [];

    constructor() {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.loadConfirmed();
        this.loadDeaths();
    }

    @action
    async loadDeaths() {
        let { incidens } = await this.client.getJSON("/api/corona/incidens/deaths");
        this.deaths = incidens;
    }

    @action
    async loadConfirmed() {
        let { incidens } = await this.client.getJSON("/api/corona/incidens/confirmed");
        this.confirmed = incidens;
    }

    @computed get deathLabels() {
        return this.deaths.map((item) => item.name);
    }

    @computed get deathData() {
        return this.deaths.map((item) => item.count);
    }

    @computed get confirmedLabels() {
        return this.confirmed.map((item) => item.name);
    }

    @computed get confirmedhData() {
        return this.confirmed.map((item) => item.count);
    }
}
