import React, { createRef, useEffect, useState } from "react";
import { ReportInterface, ReportStore } from "../stores/ReportStore";
import { observer } from "mobx-react";
import { Report } from "./Report";
import { CasesList } from "./CasesList";
import { BarReport } from "./BarReport";
import { Toggle } from "./Toggle";
import { relativeToPercentage } from "../core/functions";
import { CheckSquare, Download, Square } from "react-feather";
import domtoimage from "dom-to-image";
import { Link } from "react-router-dom";

type DataRange = "all" | "monthly" | "weekly" | "biweekly";

interface ReportCardProps {
    report: string;
    store: ReportStore;
    range?: DataRange;
    standalone?: boolean;
}

export const ReportCard = observer(({ report, store, range = "all", standalone = false }: ReportCardProps) => {
    const ref = createRef<any>();
    const [showConfirmed, setShowConfirmed] = useState(true);
    const [showDeaths, setShowDeaths] = useState(true);
    const [showRecovered, setShowRecovered] = useState(true);
    const [showActive, setShowActive] = useState(false);

    const [loaded, setLoaded] = useState(false);
    const [observing, setObserving] = useState(false);
    const [currentRange, setCurrentRange] = useState(range);

    const loadReport = async () => {
        if (!loaded) {
            observer.disconnect();
            await store.loadReport(report);
            setLoaded(true);
        }
    };

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.intersectionRatio > 0.3 && !loaded) {
                loadReport().then(() => {});
            }
        },
        {
            root: null,
            rootMargin: "0px",
            threshold: 0.3
        }
    );

    useEffect(() => {
        if (ref.current && !observing) {
            observer.observe(ref.current);
            setObserving(true);
        }
    }, [ref, observing, observer]);

    const [chart, setChart] = useState("accumulated");
    const [chartType, setChartType] = useState("logarithmic");
    let dataStore: ReportInterface | null = null;
    switch (currentRange) {
        case "all":
            dataStore = store.report;
            break;
        case "monthly":
            dataStore = store.monthly;
            break;
        case "weekly":
            dataStore = store.weekly;
            break;
        case "biweekly":
            dataStore = store.biweekly;
            break;
    }

    let deaths = dataStore ? dataStore.deaths[dataStore.deaths.length - 1] : 0;
    let confirmed = dataStore ? dataStore.confirmed[dataStore.confirmed.length - 1] : 0;
    let recovered = dataStore ? dataStore.recovered[dataStore.recovered.length - 1] : 0;
    let active = confirmed - (deaths + recovered);

    let deathsBefore = dataStore && dataStore.deaths.length > 2 ? dataStore.deaths[dataStore.deaths.length - 2] : 0;
    let confirmedBefore =
        dataStore && dataStore.confirmed.length > 2 ? dataStore.confirmed[dataStore.confirmed.length - 2] : 0;
    let recoveredBefore =
        dataStore && dataStore.recovered.length > 2 ? dataStore.recovered[dataStore.recovered.length - 2] : 0;
    let activeBefore = confirmedBefore - (deathsBefore + recoveredBefore);

    let changes = {
        confirmed: confirmed - confirmedBefore,
        deaths: deaths - deathsBefore,
        recovered: recovered - recoveredBefore,
        active: active - activeBefore
    };

    let deathsCompare = changes.deaths / deathsBefore;
    let confirmedCompare = changes.confirmed / confirmedBefore;
    let recoveredCompare = changes.recovered / recoveredBefore;
    let activeCompare = changes.active / activeBefore;

    let deathRate = deaths / confirmed;
    let recoveryRate = recovered / confirmed;
    let activityRate = active / confirmed;

    let updated = dataStore ? dataStore.labels[dataStore.labels.length - 1] : "";

    const arrReport = report.split(":");
    let reportFixed = arrReport
        .map((item) => {
            return item.charAt(0).toUpperCase() + item.slice(1);
        })
        .join(" / ");

    function getDoublingSpeed(prop: string = "confirmed") {
        if (!store.report) {
            return "";
        }
        let coll = store.report.confirmed;
        if (prop === "deaths") {
            coll = store.report.deaths;
        }
        let half = coll[coll.length - 1] / 2;
        for (let i = coll.length - 1; i >= 0; i--) {
            if (coll[i] <= half) {
                return coll.length - i;
            }
        }
        return "n/a";
    }

    const lastThreeDaysShare = (prop: string = "confirmed") => {
        if (!dataStore) {
            return 0;
        }

        let source = dataStore.confirmed;
        let compare = confirmed;
        switch (prop) {
            case "deaths":
                source = dataStore.deaths;
                compare = deaths;
                break;
        }

        let clone = [...source].slice(-4);
        let change = 0;
        for (let i = 0; i < clone.length - 1; i++) {
            change += clone[i + 1] - clone[i];
        }
        return relativeToPercentage(change / compare);
    };

    const disableAccumulatedActions = chart === "daily";
    let dates = dataStore ? dataStore.labels[0] + " - " + dataStore.labels[dataStore.labels.length - 1] : "";

    let incidensDeaths = null;
    let incidensCases = null;
    if (store.report && store.report.country && store.report.country.population) {
        incidensDeaths = Math.round(deaths / (store.report.country.population / 100000)).toLocaleString("sv-se");
        incidensCases = Math.round(confirmed / (store.report.country.population / 100000)).toLocaleString("sv-se");
    }

    return (
        <div ref={ref} className="card">
            <div className="card-header">
                {reportFixed}
                <small className={"meta"}>{dates}</small>
            </div>
            <div className="card-body">
                <ul className={"actions"}>
                    <li>
                        <a
                            href={"#all"}
                            className={currentRange === "all" ? "selected" : ""}
                            onClick={(event) => {
                                event.preventDefault();
                                setCurrentRange("all");
                            }}>
                            All
                        </a>
                    </li>
                    <li>
                        <a
                            href={"#monthly"}
                            className={currentRange === "monthly" ? "selected" : ""}
                            onClick={(event) => {
                                event.preventDefault();
                                setCurrentRange("monthly");
                            }}>
                            Last Month
                        </a>
                    </li>
                    <li>
                        <a
                            href={"#biweekly"}
                            className={currentRange === "biweekly" ? "selected" : ""}
                            onClick={(event) => {
                                event.preventDefault();
                                setCurrentRange("biweekly");
                            }}>
                            Last 14 days
                        </a>
                    </li>
                    <li>
                        <a
                            href={"#weekly"}
                            className={currentRange === "weekly" ? "selected" : ""}
                            onClick={(event) => {
                                event.preventDefault();
                                setCurrentRange("weekly");
                            }}>
                            Last Week
                        </a>
                    </li>
                </ul>

                <Toggle
                    items={[
                        {
                            key: "accumulated",
                            label: "Accumulated"
                        },
                        {
                            key: "daily",
                            label: "Daily"
                        }
                    ]}
                    selected={chart}
                    onSelect={setChart}
                />

                {chart === "accumulated" && (
                    <Report
                        showConfirmed={showConfirmed}
                        showDeaths={showDeaths}
                        showRecovered={showRecovered}
                        report={dataStore}
                        showActive={showActive}
                        type={chartType}
                    />
                )}
                {chart === "daily" && (
                    <BarReport
                        showConfirmed={showConfirmed}
                        showDeaths={showDeaths}
                        showRecovered={showRecovered}
                        report={dataStore}
                        stacked={false}
                    />
                )}

                <ul className={"actions"}>
                    <li>
                        <a
                            href={"#confirmed"}
                            className={"confirmed" + (showConfirmed ? " selected" : "")}
                            onClick={(event) => {
                                event.preventDefault();
                                setShowConfirmed(!showConfirmed);
                            }}>
                            {showConfirmed ? <CheckSquare size={14} /> : <Square size={14} />} Confirmed
                        </a>
                    </li>
                    <li>
                        <a
                            href={"#deaths"}
                            className={"deaths" + (showDeaths ? " selected" : "")}
                            onClick={(event) => {
                                event.preventDefault();
                                setShowDeaths(!showDeaths);
                            }}>
                            {showDeaths ? <CheckSquare size={14} /> : <Square size={14} />} Deaths
                        </a>
                    </li>
                    <li>
                        <a
                            href={"#recovered"}
                            className={"recovered" + (showRecovered ? " selected" : "")}
                            onClick={(event) => {
                                event.preventDefault();
                                setShowRecovered(!showRecovered);
                            }}>
                            {showRecovered ? <CheckSquare size={14} /> : <Square size={14} />} Recovered
                        </a>
                    </li>
                    <li>
                        <a
                            href={"#active"}
                            className={
                                "active" +
                                (showActive ? " selected" : "") +
                                (disableAccumulatedActions ? " disabled-action" : "")
                            }
                            onClick={(event) => {
                                event.preventDefault();
                                setShowActive(!showActive);
                            }}>
                            {showActive ? <CheckSquare size={14} /> : <Square size={14} />} Active
                        </a>
                    </li>
                </ul>

                <hr />
                <CasesList
                    deaths={deaths}
                    confirmed={confirmed}
                    recovered={recovered}
                    active={active}
                    deathRate={deathRate}
                    recoveryRate={recoveryRate}
                    activityRate={activityRate}
                    updated={updated}
                    deathsCompare={deathsCompare}
                    confirmedCompare={confirmedCompare}
                    recoveredCompare={recoveredCompare}
                    activeCompare={activeCompare}
                    changes={changes}
                />

                <hr />
                <div className="row-xs meta-info">
                    <div className="col-xs">
                        {incidensDeaths && (
                            <div className={"muted text-center"}>
                                <small>
                                    <strong>Incidens</strong>
                                    <br />
                                    <span className={"focus"}>{incidensDeaths} deaths</span> <small>/ 100K</small>
                                </small>
                            </div>
                        )}
                    </div>
                    <div className="col-xs">
                        {incidensCases && (
                            <div className={"muted text-center"}>
                                <small>
                                    <strong>Incidens</strong>
                                    <br />
                                    <span className={"focus"}>{incidensCases} cases</span> <small>/ 100K</small>
                                </small>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row-xs meta-info">
                    <div className="col-xs">
                        <div className={"muted text-center"}>
                            <small>
                                <strong>Doubling Rates</strong>
                                <br />
                                Confirmed: <span className={"focus"}>{getDoublingSpeed()} days</span>
                                <br />
                                Deaths: <span className={"focus"}>{getDoublingSpeed("deaths")} days</span>
                                <br />
                            </small>
                        </div>
                    </div>

                    <div className="col-xs">
                        <div className={"muted text-center"}>
                            <small>
                                <strong>Last 3 Days of Total</strong>
                                <br />
                                Confirmed: <span className={"focus"}>{lastThreeDaysShare()}</span>
                                <br />
                                Deaths: <span className={"focus"}>{lastThreeDaysShare("deaths")}</span>
                            </small>
                        </div>
                    </div>
                </div>

                {!standalone && (
                    <div className="btn-group">
                        <Link to={`/report/${encodeURIComponent(report)}`} className="btn">
                            Full Report
                        </Link>
                    </div>
                )}
            </div>
            <div className="card-footer">
                <a
                    href={"#download"}
                    onClick={(event) => {
                        event.preventDefault();
                        domtoimage
                            .toPng(ref.current)
                            .then(function(dataUrl) {
                                let link = document.createElement("a");
                                link.download = encodeURIComponent(reportFixed.toLowerCase()) + ".png";
                                link.href = dataUrl;
                                link.click();
                            })
                            .catch(function(error) {
                                console.error("oops, something went wrong!", error);
                            });
                    }}>
                    <Download size={14} /> Export as png
                </a>{" "}
                - coronadata.se
            </div>
        </div>
    );
});
