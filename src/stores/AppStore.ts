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
    @observable enableUserPositioning: boolean = false;
    @observable enableUserNotifications: boolean = false;
    @observable supportsNotifications: boolean = "Notification" in window;
    @observable supportsGeolocations: boolean = "geolocation" in navigator;

    constructor() {
        let showPwaPush = isIos() && !isInStandaloneMode();
        let hasShownPush = !!localStorage.getItem("pwa_push_shown");
        this.showPwa = showPwaPush && !hasShownPush;

        navigator.permissions &&
            navigator.permissions.query({ name: "geolocation" }).then((result) => {
                let { state } = result;
                if (state === "granted") {
                    this.enableUserPositioning = true;
                }
            });

        if (this.supportsNotifications) {
            navigator.permissions.query({ name: "notifications" }).then((result) => {
                this.enableUserNotifications = result.state === "granted";
            });
        }
    }

    @action
    hidePush() {
        localStorage.setItem("pwa_push_shown", JSON.stringify(true));
        this.showPwa = false;
    }

    @action
    enablePositioning() {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.enableUserPositioning = true;
            },
            (error) => {
                console.error(error);
            }
        );
    }

    @action
    enableNotifications() {
        if (!("Notification" in window)) return;
        Notification.requestPermission().then((permission) => {
            console.log(permission);
            this.enableUserNotifications = true;
        });
    }
}

export const appStore = new AppStore();
