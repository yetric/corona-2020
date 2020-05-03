import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { isInStandaloneMode } from "./core/helpers";

serviceWorker.unregister();
ReactDOM.render(<App />, document.getElementById("root"), () => {
    document.body.classList.add(isInStandaloneMode() ? "pwa" : "web");
});
