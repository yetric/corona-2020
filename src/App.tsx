import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Search } from "./components/Search";
import Analytics from "react-router-ga";

import "./core/toaster";
import { Home } from "./views/Home";

const Geo = lazy(() => import("./views/Geo"));
const Continent = lazy(() => import("./views/Continent"));
const Region = lazy(() => import("./views/Region"));
const Government = lazy(() => import("./views/Government"));
const Expectancy = lazy(() => import("./views/Expectancy"));
const Country = lazy(() => import("./views/Country"));

const NoMatchPage = () => <div>File not found</div>;

const WaitingComponent = (Component: any) => {
    return (props: any) => (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
        </Suspense>
    );
};

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
                        <Route exact path={"/continent/:continent"} component={WaitingComponent(Continent)} />
                        <Route exact path={"/region/:region"} component={WaitingComponent(Region)} />
                        <Route exact path={"/government/:government"} component={WaitingComponent(Government)} />
                        <Route exact path={"/expectancy/:expectancy"} component={WaitingComponent(Expectancy)} />
                        <Route exact path={"/c/:country"} component={WaitingComponent(Country)} />
                        <Route exact path={"/:country"} component={WaitingComponent(Geo)} />
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
