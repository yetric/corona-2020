import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useLocation, withRouter } from "react-router-dom";
import Analytics from "react-router-ga";

import "./core/toaster";

import { BarChart2 } from "react-feather";
import Home from "./views/Home";
import { observer } from "mobx-react";
import { isInStandaloneMode } from "./core/helpers";
import { Modal } from "./components/core/Modal";
import { Button } from "./components/Button";
import { getCookie, setCookie } from "./core/utils";

const NoMatchPage = () => <div>File not found</div>;

export const ScrollToTop = withRouter(() => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
});

const App = observer(() => {
    const pwaClassName = isInStandaloneMode() ? "pwa" : "web";
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        let isGDRP = getCookie("gdpr");
        !isGDRP && setShowModal(true);
    }, []);
    const setGdprCookie = () => {
        setCookie("gdpr", "true", 365);
        setShowModal(false);
    };
    return (
        <Router>
            <ScrollToTop />
            <div id="app-wrapper" className={pwaClassName}>
                <Analytics id={"UA-103000963-8"}>
                    <div className="header">
                        <h2>
                            <Link to={"/"}>
                                <BarChart2 size={18} />
                                coronadata<span>.se</span>
                            </Link>
                        </h2>
                        <small>
                            by{" "}
                            <a href={"https://yetric.se"} rel={"noopener noreferrer"} target={"_blank"}>
                                Yetric AB
                            </a>
                        </small>
                    </div>
                    <div className={"chart"}>
                        <Switch>
                            <Route exact path={"/"} component={() => <Home />} />
                            <Route component={NoMatchPage} />
                        </Switch>

                        <p className={"footer"}>
                            <a href={"https://github.com/CSSEGISandData/COVID-19"}>Data Source</a> - Built by{" "}
                            <a href={"https://yetric.se"}>Yetric AB</a>
                        </p>
                    </div>
                </Analytics>
                {showModal && (
                    <Modal header={"Cookies and similar"} footer={"Yetric AB 2020"}>
                        <h2>Privacy and Data Usage</h2>
                        <p>
                            We do store cookies and other information (localStorage etc) on your client in order to make
                            up for a better user experience and analyze how the product is used. Press "Accept" in order
                            to accept this and start using this product. Sorry for this popup, but that is how EU wants
                            it.
                        </p>
                        <Button onClick={setGdprCookie}>Accept</Button>
                    </Modal>
                )}
            </div>
        </Router>
    );
});

export default App;
