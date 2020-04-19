import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { GeoOverview } from "../components/GeoOverview";
import { IncidensStore } from "../stores/IncidensStore";
import { red, blue, yellow, purple } from "../core/colors";
import { HorizontalDataBar } from "../components/HorizontalDataBar";
import { createData } from "../core/helpers";

interface HomeProps {
    store: IncidensStore;
}

const Home = observer(({ store }: HomeProps) => {
    useEffect(() => {
        document.title = "Corona (Covid-19) Data 2020 - Graph and Table - CoronaData.se";
    });

    const deaths = createData(store.deathLabels, store.deathData, red);
    const cases = createData(store.confirmedLabels, store.confirmedhData, blue);
    const doubling = createData(store.doublingLabels, store.doublingData, purple);
    const growth = createData(store.growthLabels, store.growthData, yellow);

    return (
        <>
            <div className={"cards horizontal-bars"}>
                <HorizontalDataBar data={deaths} descr={"Min. 1M population"} name={"Deaths / 100K"} />
                <HorizontalDataBar data={cases} descr={"Min. 1M population"} name={"Confirmed Cases / 100K"} />
            </div>
            <div className={"cards horizontal-bars"}>
                <HorizontalDataBar data={doubling} descr={"Deaths - Min. 50 deaths total"} name={"Doubling Speed"} />
                <HorizontalDataBar
                    data={growth}
                    descr={"Deaths - Min. 50 deaths total"}
                    name={"Last 3 Days of Total"}
                />
            </div>

            <div className="message">
                <h3>Medecins sans Frontières</h3>
                <p>
                    We have probably only seen the beginning of the spread of Covid-19 in the world. Big parts of the
                    world will be hit hard with this pandemic and will need all the support it can get within the health
                    systems. Donate an amount to{" "}
                    <a
                        target={"_blank"}
                        rel="noopener noreferrer"
                        href={
                            "https://egen-insamling.lakareutangranser.se/en/fundraisers/hjalp-lakare-utan-granser-att-hjalpa1"
                        }>
                        Medecins sans Frontières
                    </a>{" "}
                    to help fight this virus.
                </p>

                <a
                    target={"_blank"}
                    rel="noopener noreferrer"
                    href={
                        "https://egen-insamling.lakareutangranser.se/en/fundraisers/hjalp-lakare-utan-granser-att-hjalpa1"
                    }
                    className={"btn btn-block"}>
                    Read more
                </a>
            </div>

            <GeoOverview />
        </>
    );
});

export default Home;
