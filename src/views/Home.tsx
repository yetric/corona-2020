import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { GeoOverview } from "../components/GeoOverview";

const Home = observer(() => {
    useEffect(() => {
        document.title = "Corona (Covid-19) Data 2020 - Graph and Table - CoronaData.se";
    });
    return (
        <>
            <GeoOverview />
        </>
    );
});

export default Home;
