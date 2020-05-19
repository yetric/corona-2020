import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Analytics from "react-router-ga";
import { Home as HomeIcon, Info, Search as SearchIcon, Star } from "react-feather";

import "./core/toaster";

import { Toolbar, ToolbarItem } from "./components/Toolbar";
import { BarChart2 } from "react-feather";
import { LoadingView } from "./views/Loading";
import { Search } from "./components/Search";
import Home from "./views/Home";
import { PwaPush } from "./components/PwaPush";
import { appStore } from "./stores/AppStore";
import { observer } from "mobx-react";
import { isInStandaloneMode } from "./core/helpers";
import { favStore } from "./stores/FavStore";
import { ListFavs } from "./components/ListFavs";

const Geo = lazy(() => import("./views/Geo"));
const Continent = lazy(() => import("./views/Continent"));
const Region = lazy(() => import("./views/Region"));
const Government = lazy(() => import("./views/Government"));
const Expectancy = lazy(() => import("./views/Expectancy"));
const Country = lazy(() => import("./views/Country"));
const About = lazy(() => import("./views/About"));
const World = lazy(() => import("./views/World"));

const NoMatchPage = () => <div>File not found</div>;

const WaitingComponent = (Component: any) => {
    return (props: any) => (
        <Suspense fallback={<LoadingView />}>
            <Component {...props} />
        </Suspense>
    );
};

const App = observer(() => {
    const pwaClassName = isInStandaloneMode() ? "pwa" : "web";

    const toolbarItems: ToolbarItem[] = [
        {
            icon: <HomeIcon size={16} />,
            label: "Home",
            link: "/"
        },
        {
            icon: <SearchIcon size={16} />,
            label: "Search",
            onClick: () => {}
        },
        {
            icon: <Star size={16} />,
            label: "Saved",
            onClick: () => {}
        },
        {
            icon: <Info size={16} />,
            label: "About",
            link: "/about"
        }
    ];

    return (
        <Router>
            <div id="app-wrapper" className={pwaClassName}>
                <Analytics id={"UA-103000963-8"}>
                    <div className="header">
                        <h2>
                            <Link to={"/"}>
                                <BarChart2 size={18} />
                                coronadata<span>.se</span>
                            </Link>
                        </h2>
                    </div>
                    <Search show={false} onClose={() => {}} />

                    <div className={"chart"}>
                        <Switch>
                            <Route exact path={"/about"} component={WaitingComponent(About)} />
                            <Route exact path={"/world"} component={WaitingComponent(World)} />
                            <Route exact path={"/continent/:continent"} component={WaitingComponent(Continent)} />
                            <Route exact path={"/region/:region"} component={WaitingComponent(Region)} />
                            <Route exact path={"/government/:government"} component={WaitingComponent(Government)} />
                            <Route exact path={"/expectancy/:expectancy"} component={WaitingComponent(Expectancy)} />
                            <Route exact path={"/report/:country"} component={WaitingComponent(Country)} />
                            <Route exact path={"/:country"} component={WaitingComponent(Geo)} />
                            <Route exact path={"/"} component={() => <Home />} />
                            <Route component={NoMatchPage} />
                        </Switch>

                        <p className={"footer"}>
                            <a href={"https://github.com/CSSEGISandData/COVID-19"}>Data Source</a> - Graph by{" "}
                            <a href={"https://yetric.com"}>Yetric AB</a> - Pull Requests Welcome{" "}
                            <a href={"https://github.com/yetric/corona-2020"}>here</a>
                        </p>
                    </div>

                    <ListFavs items={favStore.favorites} show={false} />
                    <PwaPush show={appStore.showPwa} />
                    <Toolbar items={toolbarItems} />
                </Analytics>
            </div>
        </Router>
    );
});

export default App;
