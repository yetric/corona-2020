import React, { createRef, useEffect, useState } from "react";
import { ReportStore } from "../stores/ReportStore";
import { observer } from "mobx-react";
import { Report } from "./Report";
import { CasesList } from "./CasesList";
import { BarReport } from "./BarReport";
import { Toggle } from "./Toggle";
import { CheckSquare, Download, Square, Star } from "react-feather";
import domtoimage from "dom-to-image";
import { Link } from "react-router-dom";
import { CountryMetadataCard } from "./CountryMetadataCard";
import { Share } from "./Share";
import { Fav, favStore } from "../stores/FavStore";
import { CountryTable } from "./CountryTable";
import { Checkbox } from "./core/Checkbox";
import { NumBox } from "./NumBox";
import World from "../views/World";
import { ReportInterface } from "../models/Reports";
import { getDoublingSpeed, lastNthDaysShare, reportUrlToHeader, toDaily } from "../core/utils";

type DataRange = "all" | "trimonthly" | "monthly" | "halfyear" | "weekly" | "biweekly" | "ma" | "death";

interface ReportCardProps {
    report: string;
    store: ReportStore;
    range?: DataRange;
    standalone?: boolean;
}

export const ReportCard = observer(({ report, store, range = "halfyear", standalone = false }: ReportCardProps) => {
    const ref = createRef<any>();
    const [showConfirmed, setShowConfirmed] = useState(true);
    const [showDeaths, setShowDeaths] = useState(true);
    const [showRecovered, setShowRecovered] = useState(false);
    const [showActive, setShowActive] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [currentRange, setCurrentRange] = useState(range);
    const observer = new IntersectionObserver(
        async ([entry]) => {
            if (entry.intersectionRatio > 0.15 && !loaded) {
                observer.disconnect();
                await store.loadReport(report, standalone);
                setLoaded(true);
            }
        },
        {
            root: null,
            rootMargin: "60px",
            threshold: 0.15,
        }
    );

    const standaloneLoading = async () => {
        await store.loadReport(report, standalone);
        if (report.startsWith("continent")) {
            let continent = decodeURIComponent(report).split(":")[1];
            await store.loadContinent(continent);
        } else if (report.startsWith("region")) {
            let continent = decodeURIComponent(report).split(":")[1];
            await store.loadRegion(continent);
        }
    };

    const lazyLoading = async () => {
        if (ref.current) {
            observer.observe(ref.current);
        }
    };

    useEffect(() => {
        standalone && standaloneLoading();
        !standalone && lazyLoading();
    }, [standalone, report, store]);

    const [chart, setChart] = useState("daily");
    const [chartType, setChartType] = useState("logarithmic");
    let dataStore: ReportInterface | null = null;
    switch (currentRange) {
        case "all":
            dataStore = store.report;
            break;
        case "halfyear":
            dataStore = store.halfyear;
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

    let { deaths, confirmed, recovered, active } = store.today;
    let changes = store.changes;

    let { deathsCompare, confirmedCompare, activeCompare, recoveredCompare } = store.dailyShareOfTotal;
    let { deathRate, recoveryRate, activityRate } = store.rates;

    let updated = dataStore ? dataStore.labels[dataStore.labels.length - 1] : "";

    let reportFixed = reportUrlToHeader(report);

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
                                All
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
                                href={"#halfyear"}
                                className={currentRange === "halfyear" ? "selected" : ""}
                                onClick={(event) => {
                                    event.preventDefault();
                                    setCurrentRange("halfyear");
                                }}>
                                180 days
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
                    </ul>

                    {standalone && (
                        <>
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
                        </>
                    )}

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

                    {standalone && (
                        <>
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
                        </>
                    )}
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
                        standalone={standalone}
                    />

                    {standalone && (
                        <>
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
                        </>
                    )}

                    {standalone && (
                        <>
                            <div className="row-xs meta-info">
                                <div className="col-xs">
                                    {incidensDeaths && (
                                        <div className={"muted text-center"}>
                                            <small>
                                                <strong>Incidens</strong>
                                                <br />
                                                <span className={"focus"}>{incidensDeaths} deaths</span>{" "}
                                                <small>/ 100K</small>
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
                                                <span className={"focus"}>{incidensCases} cases</span>{" "}
                                                <small>/ 100K</small>
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
                                            Confirmed:{" "}
                                            <span className={"focus"}>
                                                {store.report && getDoublingSpeed(store.report.confirmed)} days
                                            </span>
                                            <br />
                                            Deaths:{" "}
                                            <span className={"focus"}>
                                                {store.report && getDoublingSpeed(store.report.deaths)} days
                                            </span>
                                            <br />
                                        </small>
                                    </div>
                                </div>

                                <div className="col-xs">
                                    <div className={"muted text-center"}>
                                        <small>
                                            <strong>Last 3 Days of Total</strong>
                                            <br />
                                            Confirmed:{" "}
                                            <span className={"focus"}>
                                                {store.report && lastNthDaysShare(toDaily(store.report.confirmed), 3)}%
                                            </span>
                                            <br />
                                            Deaths:{" "}
                                            <span className={"focus"}>
                                                {store.report && lastNthDaysShare(toDaily(store.report.deaths), 3)}%
                                            </span>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {!standalone && (
                        <div className="btn-group">
                            <Link to={`/report/${encodeURIComponent(report)}`} className="btn">
                                Detailed Report
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
            {report === "world" && standalone && (
                <div className={"card world-extra"}>
                    <World />
                </div>
            )}
            <CountryMetadataCard metadata={store.metadata} />
            <CountryTable store={store} />
        </>
    );
});
