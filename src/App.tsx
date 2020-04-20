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
import { IncidensStore } from "./stores/IncidensStore";

const Geo = lazy(() => import("./views/Geo"));
const Continent = lazy(() => import("./views/Continent"));
const Region = lazy(() => import("./views/Region"));
const Government = lazy(() => import("./views/Government"));
const Expectancy = lazy(() => import("./views/Expectancy"));
const Country = lazy(() => import("./views/Country"));
const About = lazy(() => import("./views/About"));

const NoMatchPage = () => <div>File not found</div>;

const WaitingComponent = (Component: any) => {
    return (props: any) => (
        <Suspense fallback={<LoadingView />}>
            <Component {...props} />
        </Suspense>
    );
};

const App = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [showPwa, setShowPwa] = useState(false);
    const [isPwa, setIsPwa] = useState(false);
    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            const { key } = event;
            if (key === "Escape") {
                setShowSearch(false);
                setShowSaved(false);
            }
        });

        // Detects if device is on iOS
        const isIos = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent);
        };

        // Detects if device is in standalone mode
        const isInStandaloneMode = () => "standalone" in window.navigator && window.navigator["standalone"];

        setIsPwa(isInStandaloneMode());

        // Checks if should display install popup notification:
        if (isIos() && !isInStandaloneMode()) {
            setShowPwa(true);
        }
    }, []);

    const toolbarItems: ToolbarItem[] = [
        {
            icon: <HomeIcon size={16} />,
            label: "Home",
            link: "/"
        },
        {
            icon: <SearchIcon size={16} />,
            label: "Search",
            onClick: () => {
                setShowSearch(true);
            }
        },
        {
            icon: <Star size={16} />,
            label: "Saved",
            onClick: () => {
                setShowSaved(!showSaved);
            }
        },
        {
            icon: <Info size={16} />,
            label: "About",
            link: "/about"
        }
    ];

    return (
        <Router>
            <Analytics id={"UA-103000963-8"}>
                <div className="header">
                    <h2>
                        <Link to={"/"}>
                            <BarChart2 size={18} />
                            coronadata<span>.se</span>
                        </Link>
                    </h2>
                </div>
                {showSearch && (
                    <Search
                        onClose={() => {
                            setShowSearch(false);
                        }}
                    />
                )}
                <div className={"chart"}>
                    <Switch>
                        <Route exact path={"/about"} component={WaitingComponent(About)} />
                        <Route exact path={"/continent/:continent"} component={WaitingComponent(Continent)} />
                        <Route exact path={"/region/:region"} component={WaitingComponent(Region)} />
                        <Route exact path={"/government/:government"} component={WaitingComponent(Government)} />
                        <Route exact path={"/expectancy/:expectancy"} component={WaitingComponent(Expectancy)} />
                        <Route exact path={"/report/:country"} component={WaitingComponent(Country)} />
                        <Route exact path={"/:country"} component={WaitingComponent(Geo)} />
                        <Route exact path={"/"} component={() => <Home store={new IncidensStore()} />} />
                        <Route component={NoMatchPage} />
                    </Switch>

                    <p className={"footer"}>
                        <a href={"https://github.com/CSSEGISandData/COVID-19"}>Data Source</a> - Graph by{" "}
                        <a href={"https://yetric.com"}>Yetric AB</a> - Pull Requests Welcome{" "}
                        <a href={"https://github.com/yetric/corona-2020"}>here</a>
                    </p>
                </div>

                {showSaved && (
                    <div className={"saved-items-toolbox"}>
                        <div className={"card"}>
                            <div className={"card-header"}>Saved Reports</div>
                            <div className={"card-body"}>
                                <strong>WiP</strong> ipsum dolor sit amet, consectetur adipisicing elit. Atque
                                consequuntur debitis eius enim esse est explicabo inventore iure magni molestiae nisi
                                quaerat ratione sapiente sed suscipit, unde, vel velit voluptatibus?
                            </div>
                        </div>
                    </div>
                )}

                <Toolbar items={toolbarItems} />
            </Analytics>
        </Router>
    );
};

export default App;
