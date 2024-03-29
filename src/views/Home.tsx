import React, { useEffect } from "react";
import { observer } from "mobx-react";

const Home = observer(() => {
    useEffect(() => {
        document.title = "Corona (Covid-19) Data 2020 - Graph and Table - CoronaData.se";
    });

    return <div>We have stopped updating the charts since the source is no longer updated.</div>;
});

export default Home;
