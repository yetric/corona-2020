import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Geo } from "./views/Geo";
import { Search } from "./components/Search";
import Analytics from "react-router-ga";

import "./core/toaster";
import { Home } from "./views/Home";
import { Continent } from "./views/Continent";
import { Region } from "./views/Region";
import { Government } from "./views/Government";
import { Expectancy } from "./views/Expectancy";

const NoMatchPage = () => <div>File not found</div>;

const App = () => {
    return (
        <Router>
            <Analytics id={"UA-103000963-8"}>
                <div className="header">
                    <h2>
                        <Link to={"/"}>Data on Corona</Link>
                    </h2>
                    <h3>coronadata.se</h3>
                </div>

                <div className={"chart"}>
                    <Search />

                    <Switch>
                        <Route exact path={"/continent/:continent"} component={Continent} />
                        <Route exact path={"/region/:region"} component={Region} />
                        <Route exact path={"/government/:government"} component={Government} />
                        <Route exact path={"/expectancy/:expectancy"} component={Expectancy} />
                        <Route exact path={"/:country"} component={Geo} />
                        <Route exact path={"/"} component={Home} />
                        <Route component={NoMatchPage} />
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
