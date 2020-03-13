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
                <Route path={"/"}>
                    <ul className={"list-group"}>
                        <li><Link to={"/18"}>Sweden</Link></li>
                        <li><Link to={"/40"}>Norway</Link></li>
                        <li><Link to={"/174"}>Denmark</Link></li>
                        <li><Link to={"/13"}>Finland</Link></li>
                        <li><Link to={"/46"}>Iceland</Link></li>
                        <li><Link to={"/12"}>Germany</Link></li>
                        <li><Link to={"/17"}>Italy</Link></li>
                        <li><Link to={"/19"}>Spain</Link></li>
                        <li><Link to={"/160"}>France</Link></li>
                        <li><Link to={"/173"}>UK</Link></li>
                    </ul>
                </Route>
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
