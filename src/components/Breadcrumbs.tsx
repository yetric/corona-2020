import React from "react";
import { appStore } from "../stores/AppStore";

export const Breadcrumbs = () =>
    appStore.breadcrumbs.length > 0 ? (
        <div className="breadcrumbs">
            <ul>
                {appStore.breadcrumbs.map((crumb) => {
                    return <li>{crumb.label}</li>;
                })}
            </ul>
        </div>
    ) : null;
