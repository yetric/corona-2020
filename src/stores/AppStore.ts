import { action, observable } from "mobx";
import { isInStandaloneMode, isIos } from "../core/helpers";

interface Crumb {
    label: string;
    active: boolean;
    link: string;
}

class AppStore {
    @observable breadcrumbs: Crumb[] = [];
    @observable showPwa: boolean = false;

    constructor() {
        let showPwaPush = isIos() && !isInStandaloneMode();
        let hasShownPush = !!localStorage.getItem("pwa_push_shown");
        this.showPwa = showPwaPush && !hasShownPush;
    }

    @action
    hidePush() {
        localStorage.setItem("pwa_push_shown", JSON.stringify(true));
        this.showPwa = false;
    }
}

export const appStore = new AppStore();
