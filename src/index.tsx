import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { isInStandaloneMode } from "./core/helpers";
import { GaDimension, setDimension } from "./core/tracking";

serviceWorker.unregister();
ReactDOM.render(<App />, document.getElementById("root"), () => {
    let platform = isInStandaloneMode() ? "pwa" : "web";
    document.body.classList.add(platform);
    setDimension({
        value: platform,
        index: GaDimension.PLATFORM
    });
});
