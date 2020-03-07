import {observable} from "mobx";

class DataStore {
    @observable activeData = null;
}

export const dataStore = new DataStore();