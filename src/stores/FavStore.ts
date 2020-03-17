import { action, observable } from "mobx";

export interface Fav {
    id: number;
    name: string;
    province?: string;
}

export class FavStore {
    @observable favorites: Fav[] = [];

    constructor() {
        const favJSON = localStorage.getItem("cd_favs");
        if (favJSON) {
            this.favorites = JSON.parse(favJSON);
        }
    }

    has(fav: Fav) {
        for (let i = 0; i < this.favorites.length; i++) {
            let f = this.favorites[i];
            if (f.id === fav.id) {
                return true;
            }
        }
        return false;
    }

    @action
    save(fav: Fav) {
        const favJSON = localStorage.getItem("cd_favs");
        let favs = [];
        if (favJSON) {
            favs = JSON.parse(favJSON);
        }
        if (!this.has(fav)) {
            favs.unshift(fav);
            localStorage.setItem("cd_favs", JSON.stringify(favs));
            this.favorites = favs;
        }
    }

    @action
    remove(id: number) {
        let indexToRemove = -1;
        const favJSON = localStorage.getItem("cd_favs");
        let favs = [];
        if (favJSON) {
            favs = JSON.parse(favJSON);
            for (let i = 0; i < favs.length; i++) {
                let f = favs[i];
                if (f.id === id) {
                    indexToRemove = i;
                    break;
                }
            }
            if (indexToRemove > -1) {
                favs.splice(indexToRemove, 1);
                localStorage.setItem("cd_favs", JSON.stringify(favs));
                this.favorites = favs;
            }
        }
    }
}

export const favStore = new FavStore();
