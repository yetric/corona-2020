import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { ExpectancyStore } from "../stores/ExpectancyStore";
import { LocationList } from "../components/LocationList";

const Expectancy = observer(() => {
    let { expectancy }: any = useParams();
    let expectancyStore: ExpectancyStore;

    if (!expectancy) {
        return null;
    }

    useEffect(() => {
        document.title = "Life Expectancy " + expectancy + " (+-5%) - Covid-19 - CoronaData.se";
    });

    expectancyStore = new ExpectancyStore(parseFloat(expectancy));

    return (
        <>
            <LocationList store={expectancyStore} title={"Life Expectancy / " + expectancy + " (+-5%)"} />
        </>
    );
});

export default Expectancy;
