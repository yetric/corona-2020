import React, { useEffect } from "react";
import { DataStore } from "../stores/DataStore";
import { observer } from "mobx-react";
import { useParams, withRouter } from "react-router-dom";
import { Share } from "../components/Share";
import { favStore } from "../stores/FavStore";
import { SaveBtn } from "../components/SaveBtn";
import { AccumulatedGraph } from "../components/AccumulatedGraph";
import { LoadOverlay } from "../components/LoadOverlay";
import { DailyBars } from "../components/DailyBars";
import { RightNowCard } from "../components/RightNowCard";
import { CountryCard } from "../components/CountryCard";
import { TabularData } from "../components/TabularData";
import { Growth } from "../components/Growth";
import { ActivityRate } from "../components/ActivityRate";
import { Toggle } from "../components/Toggle";

interface ProvinceProps {
    selected?: any;
}

interface GeoProps {
    history: any;
}

const dataStore = new DataStore();

const Geo = withRouter(
    observer(({ history }: GeoProps) => {
        let { country } = useParams();
        useEffect(() => {
            country && dataStore.loadCountry(parseInt(country));
            window.scrollTo(0, 0);
        }, [country]);

        useEffect(() => {
            if (dataStore.data?.geo.country) {
                document.title = dataStore.data?.geo.country + " - Covid-19 - CoronaData.se";
            }
        });

        const provinceName = dataStore.provinces.length > 0 ? <small>({dataStore.data?.geo.province})</small> : null;

        const getProvinceDropDown = ({ selected }: ProvinceProps) => {
            const options = dataStore.provinces.map((province) => {
                return (
                    <option key={"province-dd-" + province.id} value={province.value}>
                        {province.province}
                    </option>
                );
            });
            return (
                <>
                    <select
                        onChange={(event) => {
                            event.preventDefault();
                            dataStore.provinces.forEach((p) => {
                                if (p.province === event.target.value) {
                                    history.push("/" + p.id);
                                }
                            });
                        }}
                        value={selected}>
                        {options}
                    </select>
                </>
            );
        };

        let showSaveBtn = true;
        if (country && dataStore.data?.geo) {
            showSaveBtn = !favStore.has({
                id: parseInt(country),
                name: dataStore.data.geo.country,
                province: dataStore.data.geo.province
            });
        }

        let casesPerHundraK = "";

        if (dataStore.metadata.population && dataStore.data?.confirmed.count) {
            let hundredK = parseInt(dataStore.metadata.population) / 100000;
            let relative = dataStore.data?.confirmed.count / hundredK;
            casesPerHundraK = (Math.round(relative * 10) / 10).toLocaleString("sv-se");
        }

        const provinces =
            dataStore.provinces.length > 0 ? getProvinceDropDown({ selected: dataStore.data?.geo.province }) : null;

        return (
            <div className={"geo-wrapper"}>
                <div className="card">
                    <LoadOverlay loading={dataStore.loading} text={"Loading graphs"} />
                    <div className="card-header">
                        {dataStore.data?.geo.country} {provinceName} {provinces}
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <AccumulatedGraph dataStore={dataStore} />
                            </div>
                            <div className="col">
                                <DailyBars dataStore={dataStore} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <Growth dataStore={dataStore} />
                            </div>
                            <div className="col">
                                <ActivityRate dataStore={dataStore} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <RightNowCard dataStore={dataStore} casesPerHundraK={casesPerHundraK} />
                            </div>
                            <div className="col">
                                {country && <CountryCard dataStore={dataStore} country={parseInt(country)} />}
                            </div>
                            <div className="col">
                                <TabularData dataStore={dataStore} />
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <Share />
                    </div>
                </div>

                {showSaveBtn && dataStore.data?.geo && country && (
                    <SaveBtn
                        id={parseInt(country)}
                        countryName={dataStore.data?.geo.country}
                        provinceName={dataStore.data?.geo.province}
                    />
                )}
            </div>
        );
    })
);

export default Geo;
