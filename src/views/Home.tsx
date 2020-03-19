import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Dashboard } from "../components/Dashboard";
import { Links } from "../components/Links";
import { Advice } from "../components/Advice";
import { About } from "../components/About";

export const Home = observer(() => {
    useEffect(() => {
        document.title = "Corona (Covid-19) Data 2020 - Graph and Table - CoronaData.se";
    });
    return (
        <>
            <Dashboard />
            <div className={"row"}>
                <div className="col">
                    <Advice />
                </div>

                <div className="col">
                    <About />
                </div>

                <div className="col">
                    <Links />
                </div>
            </div>
        </>
    );
});
