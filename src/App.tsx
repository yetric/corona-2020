import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Geo } from "./views/Geo";
import { Search } from "./components/Search";
import Analytics from "react-router-ga";

const App = () => {
    return (
        <Router>
            <Analytics id={"UA-103000963-8"}>
                <div className={"chart"}>
                    <h2>
                        <Link to={"/"}>Data on Corona</Link>
                    </h2>

                    <Search />

                    <Switch>
                        <Route path={"/:country"} component={Geo} />
                        <Route path={"/"}>
                            <ul className={"list-group"}>
                                <li>
                                    <Link to={"/18"}>Sweden</Link>
                                </li>
                                <li>
                                    <Link to={"/40"}>Norway</Link>
                                </li>
                                <li>
                                    <Link to={"/174"}>Denmark</Link>
                                </li>
                                <li>
                                    <Link to={"/13"}>Finland</Link>
                                </li>
                                <li>
                                    <Link to={"/46"}>Iceland</Link>
                                </li>
                                <li>
                                    <Link to={"/12"}>Germany</Link>
                                </li>
                                <li>
                                    <Link to={"/17"}>Italy</Link>
                                </li>
                                <li>
                                    <Link to={"/19"}>Spain</Link>
                                </li>
                                <li>
                                    <Link to={"/160"}>France</Link>
                                </li>
                                <li>
                                    <Link to={"/173"}>UK</Link>
                                </li>
                            </ul>
                        </Route>
                    </Switch>

                    <p className={"footer"}>
                        <a href={"https://github.com/CSSEGISandData/COVID-19"}>Data Source</a> - Graph by{" "}
                        <a href={"https://yetric.com"}>Yetric AB</a> - Pull Requests Welcome{" "}
                        <a href={"https://github.com/yetric/corona-2020"}>here</a>
                    </p>
                </div>
            </Analytics>
        </Router>
    );
};

export default App;
