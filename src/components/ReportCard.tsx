import React, { createRef, useEffect, useState } from "react";
import { ReportInterface, ReportStore } from "../stores/ReportStore";
import { observer } from "mobx-react";
import { Report } from "./Report";
import { CasesList } from "./CasesList";
import { BarReport } from "./BarReport";
import { Toggle } from "./Toggle";
import { relativeToPercentage } from "../core/functions";
import { CheckSquare, Download, Square, Star } from "react-feather";
import domtoimage from "dom-to-image";
import { Link } from "react-router-dom";
import { CountryMetadataCard } from "./CountryMetadataCard";
import { Share } from "./Share";
import { Fav, favStore } from "../stores/FavStore";
import { CountryTable } from "./CountryTable";
import { Checkbox } from "./core/Checkbox";
import { NumBox } from "./NumBox";

type DataRange = "all" | "trimonthly" | "monthly" | "weekly" | "biweekly" | "ma" | "death";

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
    const [showRecovered, setShowRecovered] = useState(false);
    const [showActive, setShowActive] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [observing, setObserving] = useState(false);
    const [currentRange, setCurrentRange] = useState(range);

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.intersectionRatio > 0.3 && !loaded) {
                loadReport().then(() => {});
            }
        },
        {
            root: null,
            rootMargin: "0px",
            threshold: 0.3,
        }
    );

    const loadReport = async () => {
        if (!loaded && !standalone) {
            observer.disconnect();
            await store.loadReport(report, standalone);
            setLoaded(true);
        }
    };

    useEffect(() => {
        if (report.startsWith("continent") && standalone) {
            let continent = decodeURIComponent(report).split(":")[1];
            store.loadContinent(continent).catch(() => {});
        } else if (report.startsWith("region") && standalone) {
            let continent = decodeURIComponent(report).split(":")[1];
            store.loadRegion(continent).catch(() => {});
        }
    }, [report, store, standalone]);

    useEffect(() => {
        if (!standalone && ref.current && !observing) {
            observer.observe(ref.current);
            setObserving(true);
        }
    }, [standalone, ref, observing, observer]);

    useEffect(() => {
        if (standalone) {
            store.loadReport(report, standalone).catch(() => {});
        }
    }, [standalone, report, store]);

    const [chart, setChart] = useState("daily");
    const [chartType, setChartType] = useState("linear");
    let dataStore: ReportInterface | null = null;
    switch (currentRange) {
        case "all":
            dataStore = store.weeklyReport;
            break;
        case "trimonthly":
            dataStore = store.trimonthly;
            break;
        case "monthly":
            dataStore = store.monthly;
            break;
        case "biweekly":
            dataStore = store.biweekly;
            break;
        case "death":
            dataStore = store.firstDeath;
            break;
    }

    let deaths = store.report ? store.report.deaths[store.report.deaths.length - 1] : 0;
    let confirmed = store.report ? store.report.confirmed[store.report.confirmed.length - 1] : 0;
    let recovered = store.report ? store.report.recovered[store.report.recovered.length - 1] : 0;
    let active = confirmed - (deaths + recovered);

    let deathsBefore =
        store.report && store.report.deaths.length > 2 ? store.report.deaths[store.report.deaths.length - 2] : 0;
    let confirmedBefore =
        store.report && store.report.confirmed.length > 2
            ? store.report.confirmed[store.report.confirmed.length - 2]
            : 0;
    let recoveredBefore =
        store.report && store.report.recovered.length > 2
            ? store.report.recovered[store.report.recovered.length - 2]
            : 0;
    let activeBefore = confirmedBefore - (deathsBefore + recoveredBefore);

    let changes = {
        confirmed: confirmed - confirmedBefore,
        deaths: deaths - deathsBefore,
        recovered: recovered - recoveredBefore,
        active: active - activeBefore,
    };

    let deathsCompare = changes.deaths / deathsBefore;
    let confirmedCompare = changes.confirmed / confirmedBefore;
    let recoveredCompare = changes.recovered / recoveredBefore;
    let activeCompare = changes.active / activeBefore;

    let deathRate = deaths / confirmed;
    let recoveryRate = recovered / confirmed;
    let activityRate = active / confirmed;

    let updated = dataStore ? dataStore.labels[dataStore.labels.length - 1] : "";

    const arrReport = decodeURIComponent(report).split(":");
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

    let dates = dataStore ? dataStore.labels[0] + " - " + dataStore.labels[dataStore.labels.length - 1] : "";

    let incidensDeaths = null;
    let incidensCases = null;
    if (store.report && store.report.country && store.report.country.population) {
        incidensDeaths = Math.round(deaths / (store.report.country.population / 100000)).toLocaleString("sv-se");
        incidensCases = Math.round(confirmed / (store.report.country.population / 100000)).toLocaleString("sv-se");
    }

    let newFav: Fav = {
        name: report,
    };

    return (
        <>
            <div ref={ref} className="card">
                <div className="card-header">
                    <Star
                        className={favStore.has(newFav) ? "selected" : ""}
                        onClick={() => {
                            if (!favStore.has(newFav)) {
                                favStore.save(newFav);
                            }
                        }}
                        size={14}
                    />{" "}
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
                                Weekly
                            </a>
                        </li>
                        <li>
                            <a
                                href={"#death"}
                                className={currentRange === "ma" || currentRange === "death" ? "selected" : ""}
                                onClick={(event) => {
                                    event.preventDefault();
                                    setCurrentRange("death");
                                }}>
                                1st Death
                            </a>
                        </li>
                        <li>
                            <a
                                href={"#trimonthly"}
                                className={currentRange === "trimonthly" ? "selected" : ""}
                                onClick={(event) => {
                                    event.preventDefault();
                                    setCurrentRange("trimonthly");
                                }}>
                                90 days
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
                                30 days
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
                                14 days
                            </a>
                        </li>
                    </ul>

                    <div className={"controls"}>
                        <Checkbox
                            onChange={(flatten: boolean) => {
                                store.setUseMovingAvg(flatten);
                            }}
                            checked={store.movingAvg}
                            label={"Moving Avg."}
                        />
                        <NumBox
                            onChange={(num: number) => {
                                store.setMovingAvgSpan(num);
                            }}
                            enabled={store.movingAvg}
                            value={store.movingAvgSpan}
                            label={"%d days"}
                        />
                    </div>

                    <div className="toggles">
                        <Toggle
                            items={[
                                {
                                    key: "linear",
                                    label: "Linear",
                                },
                                {
                                    key: "logarithmic",
                                    label: "Logarithmic",
                                },
                            ]}
                            selected={chartType}
                            onSelect={setChartType}
                        />
                        <Toggle
                            items={[
                                {
                                    key: "accumulated",
                                    label: "Accumulated",
                                },
                                {
                                    key: "daily",
                                    label: "Daily",
                                },
                            ]}
                            selected={chart}
                            onSelect={setChart}
                        />
                    </div>

                    {chart === "accumulated" && (
                        <>
                            <Report
                                showConfirmed={showConfirmed}
                                showDeaths={showDeaths}
                                showRecovered={showRecovered}
                                report={dataStore}
                                showActive={showActive}
                                type={chartType}
                            />
                        </>
                    )}
                    {chart === "daily" && (
                        <BarReport
                            showConfirmed={showConfirmed}
                            showDeaths={showDeaths}
                            showRecovered={showRecovered}
                            showActive={showActive}
                            report={dataStore}
                            stacked={false}
                            type={chartType}
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
                                className={"active" + (showActive ? " selected" : "")}
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

                    <p className={"divider-text"}>Peak Dates</p>
                    <div className="max-date">
                        <div>
                            <span>Confirmed</span>
                            <p>
                                <span className={"date"}>{store.peakConfirmed?.date}</span>
                                <br />
                                {store.peakConfirmed?.count.toLocaleString("sv-se")}
                            </p>
                        </div>
                        <div>
                            <span>Deaths</span>
                            <p>
                                <span className={"date"}>{store.peakDeaths?.date}</span>
                                <br />
                                {store.peakDeaths?.count.toLocaleString("sv-se")}
                            </p>
                        </div>
                    </div>
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
                {standalone && (
                    <div className="card-footer">
                        <Share />
                        <a
                            href={"#download"}
                            onClick={(event) => {
                                event.preventDefault();
                                domtoimage
                                    .toPng(ref.current)
                                    .then(function (dataUrl) {
                                        let link = document.createElement("a");
                                        link.download = encodeURIComponent(reportFixed.toLowerCase()) + ".png";
                                        link.href = dataUrl;
                                        link.click();
                                    })
                                    .catch(function (error) {
                                        console.error("oops, something went wrong!", error);
                                    });
                            }}>
                            <Download size={14} /> Export as png
                        </a>{" "}
                        - coronadata.se
                    </div>
                )}
            </div>
            <CountryMetadataCard metadata={store.metadata} />
            <CountryTable store={store} />
        </>
    );
});
