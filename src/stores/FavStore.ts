import { action, observable } from "mobx";

export interface Fav {
    id: number;
    name: string;
}

export class FavStore {
    @observable favorites: Fav[] = [];

    constructor() {
        const favJSON = localStorage.getItem('cd_favs');
        if (favJSON) {
            this.favorites = JSON.parse(favJSON);
        }
    }

    @action
    save(fav: Fav) {
        const favJSON = localStorage.getItem('cd_favs');
        let favs = [];
        if (favJSON) {
            favs = JSON.parse(favJSON);
        }

        favs.unshift(fav);
        localStorage.setItem('cd_favs', JSON.stringify(favs));
        this.favorites = favs;
    }

    @action
    remove(fav: Fav) {

    }
}

export const favStore = new FavStore();