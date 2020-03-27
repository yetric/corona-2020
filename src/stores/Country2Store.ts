import { DataClient } from "../clients/DataClient";
import { action } from "mobx";

export class Country2Store {
    private client: DataClient;
    private readonly countryName: string;

    constructor(countryName: string) {
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
        this.countryName = countryName;
        this.loadBasic();
    }

    @action
    async loadBasic() {
        const basic = await this.client.getJSON("/api/corona/c/" + this.countryName);
        console.log(basic);
    }
}
