import React from "react";
import "./Dashboard.css";
import { CoronaMap } from "./CoronaMap";
import { MapStore } from "../stores/MapStore";
import { observer } from "mobx-react";

const mapStore = new MapStore();

export const Dashboard = observer(() => {
    return (
        <div className={"row"} id={"dashboard"}>
            <div className="col col-2 map-holder">
                {mapStore.loading && (
                    <div className="loading-overlay">
                        <div>
                            <span>Loading Map Data ...</span>
                        </div>
                    </div>
                )}
                <CoronaMap lat={46.8182} lng={8.2275} zoom={2} geoJSON={mapStore.geometry} />
            </div>
            <div className="col col-1" id={"dashboard-countries"}>
                <ul className={"list-group"}>
                    <li>
                        <a
                            href={"#sdfsdfsdf"}
                            onClick={(event) => {
                                event.preventDefault();
                                mapStore.load(91);
                            }}>
                            United States
                        </a>
                    </li>
                    <li>
                        <a
                            href={"#"}
                            onClick={(event) => {
                                event.preventDefault();
                                mapStore.load(96);
                            }}>
                            China
                        </a>
                    </li>
                    <li>
                        <a
                            href={"#"}
                            onClick={(event) => {
                                event.preventDefault();
                                mapStore.load(16);
                            }}>
                            Sweden
                        </a>
                    </li>
                    <li>
                        <a href={"#"}>sdfsdf</a>
                    </li>
                    <li>
                        <a href={"#"}>sdfsdf</a>
                    </li>
                    <li>
                        <a href={"#"}>sdfsdf</a>
                    </li>
                    <li>
                        <a href={"#"}>sdfsdf</a>
                    </li>
                    <li>
                        <a href={"#"}>sdfsdf</a>
                    </li>
                    <li>
                        <a href={"#"}>sdfsdf</a>
                    </li>
                    <li>
                        <a href={"#"}>sdfsdf</a>
                    </li>
                </ul>
            </div>
        </div>
    );
});
