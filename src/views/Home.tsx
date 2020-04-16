import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { GeoOverview } from "../components/GeoOverview";

const Home = observer(() => {
    useEffect(() => {
        document.title = "Corona (Covid-19) Data 2020 - Graph and Table - CoronaData.se";
    });
    return (
        <>
            <div className="cards">
                <div className="card">
                    <div className="card-header">Daily Highs</div>
                    <div className="card-body">
                        <dl className={"small-dl"}>
                            <dt>Confirmed</dt>
                            <dd>-</dd>
                            <dt>Deaths</dt>
                            <dd>-</dd>
                            <dt>Recovery</dt>
                            <dd>-</dd>
                        </dl>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">Fastest Growing Rates</div>
                    <div className="card-body">
                        <dl className={"small-dl"}>
                            <dt>Confirmed</dt>
                            <dd>
                                100 000 <small>dfsd</small>
                            </dd>
                            <dt>Deaths</dt>
                            <dd>-</dd>
                            <dt>Recovery</dt>
                            <dd>-</dd>
                        </dl>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">Numbers Column</div>
                    <div className="card-body">
                        <dl className={"small-dl"}>
                            <dt>Death Rate</dt>
                            <dd>-</dd>
                            <dt>Death Incidens</dt>
                            <dd>-</dd>
                            <dt>Cases Incidens</dt>
                            <dd>-</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <GeoOverview />
        </>
    );
});

export default Home;
