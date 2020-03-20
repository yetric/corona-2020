import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { ListFavs } from "../components/ListFavs";
import { Links } from "../components/Links";
import { Advice } from "../components/Advice";
import { About } from "../components/About";
import { GeoOverview } from "../components/GeoOverview";

export const Home = observer(() => {
    useEffect(() => {
        document.title = "Corona (Covid-19) Data 2020 - Graph and Table - CoronaData.se";
    });
    return (
        <>
            <GeoOverview />
            <div className={"row"}>
                <div className="col">
                    <ListFavs />
                </div>
                <div className="col">
                    <Links />
                </div>
            </div>
            <div className={"row"}>
                <div className="col">
                    <Advice />
                </div>

                <div className="col">
                    <About />
                </div>
            </div>
        </>
    );
});
