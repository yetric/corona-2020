import React, { createRef, useEffect, useState } from "react";
import { ReportStore } from "../stores/ReportStore";
import { observer } from "mobx-react";
import { Report } from "./Report";
import { CasesList } from "./CasesList";
import { BarReport } from "./BarReport";
import { Toggle } from "./Toggle";
import { relativeToPercentage } from "../core/functions";
import { CheckSquare, Square } from "react-feather";

interface ReportCardProps {
    report: string;
    store: ReportStore;
}

export const ReportCard = observer(({ report, store }: ReportCardProps) => {
    const ref = createRef<HTMLDivElement>();
    const [showConfirmed, setShowConfirmed] = useState(true);
    const [showDeaths, setShowDeaths] = useState(true);
    const [showRecovered, setShowRecovered] = useState(true);
    const [showActive, setShowActive] = useState(false);

    const [loaded, setLoaded] = useState(false);
    const [observing, setObserving] = useState(false);

    const loadReport = async () => {
        if (!loaded) {
            observer.disconnect();
            await store.loadReport(report);
            setLoaded(true);
        }
    };

    const observer = new IntersectionObserver(
        ([entry]) => {
            console.log(entry.intersectionRatio);
            if (entry.intersectionRatio > 0.3 && !loaded) {
                loadReport();
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
        active: active - activeBefore
    };

    let deathsCompare = changes.deaths / deathsBefore;
    let confirmedCompare = changes.confirmed / confirmedBefore;
    let recoveredCompare = changes.recovered / recoveredBefore;
    let activeCompare = changes.active / activeBefore;

    let deathRate = deaths / confirmed;
    let recoveryRate = recovered / confirmed;
    let activityRate = active / confirmed;

    let updated = store.report ? store.report.labels[store.report.labels.length - 1] : "";

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
        if (!store.report) {
            return 0;
        }

        let source = store.report.confirmed;
        let compare = confirmed;
        switch (prop) {
            case "deaths":
                source = store.report.deaths;
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

    return (
        <div ref={ref} className="card">
            <div className="card-header">{reportFixed}</div>
            <div className="card-body">
                <Toggle
                    items={[
                        {
                            key: "linear",
                            label: "Linear"
                        },
                        {
                            key: "logarithmic",
                            label: "Logarithmic"
                        }
                    ]}
                    selected={chartType}
                    onSelect={setChartType}
                    className={"pull-left"}
                />
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
                        report={store.report}
                        showActive={showActive}
                        type={"logarithmic"}
                    />
                )}
                {chart === "daily" && (
                    <BarReport
                        showConfirmed={showConfirmed}
                        showDeaths={showDeaths}
                        showRecovered={showRecovered}
                        report={store.report}
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

                <hr />

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
            </div>
        </div>
    );
});
