import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { ListFavs } from "../components/ListFavs";
import { Links } from "../components/Links";
import { Advice } from "../components/Advice";
import { About } from "../components/About";
import { GeoOverview } from "../components/GeoOverview";
import { Modal } from "../components/core/Modal";

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
            {/*
            <Modal header={"Welcome to CoronaData.se"} footer={"CoronaData.se by Yetric AB - 2020"} allowClose={true} steps={[
                "Step 1", "Step 2", "Step 3"
            ]}>
                <p>Ok, before we start (we will only show this the first time) there are some stuff we need to take care of:</p>

                <ol>
                    <li>Stay Safe, Stay Home</li>
                </ol>
            </Modal>*/}
        </>
    );
});
