import React from "react";
import "./PwaPush.scss";
import { Share } from "react-feather";
import { appStore } from "../stores/AppStore";

interface PwaPushProps {
    show: boolean;
}

export const PwaPush = ({ show }: PwaPushProps) => {
    return show ? (
        <div className={"pwa-push"}>
            <p>
                Install this app on your iPhone/iPad: tap <Share size={16} color={"#4eb9e4"} /> and then "Add to
                homescreen".{" "}
                <a href={"#close-pwa"} onClick={appStore.hidePush.bind(appStore)}>
                    Close
                </a>
            </p>
        </div>
    ) : null;
};
