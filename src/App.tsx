import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Analytics from "react-router-ga";
import { Home as HomeIcon, Info, Search as SearchIcon, Star } from "react-feather";

import "./core/toaster";

import { Toolbar, ToolbarItem } from "./components/Toolbar";
import { BarChart2 } from "react-feather";
import { LoadingView } from "./views/Loading";
import { Search } from "./components/Search";

const Geo = lazy(() => import("./views/Geo"));
const Continent = lazy(() => import("./views/Continent"));
const Region = lazy(() => import("./views/Region"));
const Government = lazy(() => import("./views/Government"));
const Expectancy = lazy(() => import("./views/Expectancy"));
const Country = lazy(() => import("./views/Country"));
const About = lazy(() => import("./views/About"));
const Home = lazy(() => import("./views/Home"));

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
    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            const { key } = event;
            if (key === "Escape") {
                setShowSearch(false);
            }
        });
    });

    const toolbarItems: ToolbarItem[] = [
        {
            icon: <HomeIcon size={18} />,
            label: "Home",
            link: "/"
        },
        {
            icon: <SearchIcon size={18} />,
            label: "Search",
            onClick: () => {
                setShowSearch(true);
            }
        },
        {
            icon: <Star size={18} />,
            label: "Saved",
            onClick: () => {
                alert("Show saved items");
            }
        },
        {
            icon: <Info size={18} />,
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
                            coronadata.se
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
                        <Route exact path={"/c/:country"} component={WaitingComponent(Country)} />
                        <Route exact path={"/:country"} component={WaitingComponent(Geo)} />
                        <Route exact path={"/"} component={WaitingComponent(Home)} />
                        <Route component={NoMatchPage} />
                    </Switch>

                    <p className={"footer"}>
                        <a href={"https://github.com/CSSEGISandData/COVID-19"}>Data Source</a> - Graph by{" "}
                        <a href={"https://yetric.com"}>Yetric AB</a> - Pull Requests Welcome{" "}
                        <a href={"https://github.com/yetric/corona-2020"}>here</a>
                    </p>
                </div>
                <Toolbar items={toolbarItems} />
            </Analytics>
        </Router>
    );
};

export default App;
