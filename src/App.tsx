import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Home } from "./views/Home";
import { Search } from "./components/Search";



const App = () => {

    return (
        <Router>
        <div className={"chart"}>
            <h2>Data on Corona</h2>

            <Search />

            <Switch>
                <Route path={"/:country"} component={Home} />
            </Switch>


            <p className={"footer"}>
                <a href={"https://github.com/CSSEGISandData/COVID-19"}>Data Source</a> - Graph by{" "}
                <a href={"https://yetric.com"}>Yetric AB</a> - Pull Requests Welcome{" "}
                <a href={"https://github.com/yetric/corona-2020"}>here</a>
            </p>
        </div>
        </Router>
    );
};

export default App;
