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
    @observable doubling: CountryIncidens[] = [];

    constructor() {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.loadConfirmed();
        this.loadDeaths();
        this.loadDoubling();
    }

    @action
    async loadDeaths() {
        let { incidens } = await this.client.getJSON("/api/corona/incidens/deaths");
        this.deaths = incidens;
    }

    @action
    async loadDoubling() {
        let { doubling } = await this.client.getJSON("/api/corona/doubling/deaths");
        this.doubling = doubling;
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

    @computed get doublingLabels() {
        return this.doubling.map((item) => item.name);
    }

    @computed get doublingData() {
        return this.doubling.map((item) => item.count);
    }
}
