import { action, observable } from "mobx";
import { CachedList } from "../core/storage";

export interface Fav {
    id?: number;
    name: string;
    province?: string;
}

export class FavStore {
    @observable favorites: Fav[] = [];
    private cachedList: CachedList;

    constructor() {
        this.favorites = FavStore.read();
        this.cachedList = new CachedList({
            name: "cd_favs_test",
            length: 10
        });
    }

    private static read() {
        const favJSON = localStorage.getItem("cd_favs");
        return favJSON ? JSON.parse(favJSON) : [];
    }

    private sync(favs: Fav[]) {
        localStorage.setItem("cd_favs", JSON.stringify(favs));
        this.favorites = favs;
    }

    has(fav: Fav) {
        // return this.cachedList.has(fav);
        for (let i = 0; i < this.favorites.length; i++) {
            let item = this.favorites[i];
            if (item.name === fav.name) {
                return true;
            }
        }
        return false;
    }

    @action
    save(fav: Fav) {
        if (!this.has(fav)) {
            let favs = FavStore.read();
            favs.unshift(fav);
            this.sync(favs);
        }
    }

    @action
    remove(name: string) {
        let favs = FavStore.read();
        for (let i = 0; i < favs.length; i++) {
            let item = favs[i];
            if (item.name === name) {
                favs.splice(i, 1);
                this.sync(favs);
                break;
            }
        }
    }
}

export const favStore = new FavStore();
