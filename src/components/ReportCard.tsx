import React, { createRef, useEffect, useState } from "react";
import { ReportStore } from "../stores/ReportStore";
import { observer } from "mobx-react";
import { Report } from "./Report";
import { CasesList } from "./CasesList";
import { BarReport } from "./BarReport";
import { Toggle } from "./Toggle";
import { Star } from "react-feather";
import { Link } from "react-router-dom";
import { CountryMetadataCard } from "./CountryMetadataCard";
import { Share } from "./Share";
import { Fav, favStore } from "../stores/FavStore";
import { CountryTable } from "./CountryTable";
import World from "../views/World";
import { DataRange, LabelActionProps, ReportInterface, TimeSpanActionProps } from "../models/Reports";
import { reportUrlToHeader } from "../core/utils";
import { TimeSpan } from "./TimeSpan";
import { GraphLabelActions } from "./GraphLabelActions";
import { MovingAvg } from "./MovingAvg";
import { PeakDates } from "./PeakDates";
import { DoublingDates } from "./DoublingDates";
import { DownloadReport } from "./DownloadReport";

interface ReportCardProps {
    report: string;
    store: ReportStore;
    range?: DataRange;
    standalone?: boolean;
}

export const ReportCard = observer(({ report, store, range = "trimonthly", standalone = false }: ReportCardProps) => {
    const ref = createRef<any>();
    const [showConfirmed, setShowConfirmed] = useState(true);
    const [showDeaths, setShowDeaths] = useState(false);
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

    useEffect(() => {
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
        standalone && standaloneLoading();
        !standalone && lazyLoading();
        // eslint-disable-next-line
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
        case "yearly":
            dataStore = store.yearly;
            break;
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    let { deaths, confirmed, recovered, active } = store.today;
    let changes = store.changes;

    let { deathsCompare, confirmedCompare, activeCompare, recoveredCompare } = store.dailyShareOfTotal;
    let { deathRate, recoveryRate, activityRate } = store.rates;

    let updated = dataStore ? dataStore.labels[dataStore.labels.length - 1] : "";

    let reportFixed = reportUrlToHeader(report);

    let dates = dataStore ? dataStore.labels[0] + " - " + dataStore.labels[dataStore.labels.length - 1] : "";

    let newFav: Fav = {
        name: report,
    };

    const timeSpans: TimeSpanActionProps[] = [
        {
            reportName: "yearly",
            label: "Last year",
        },
        {
            reportName: "halfyear",
            label: "180 Days",
        },
        {
            reportName: "trimonthly",
            label: "90 Days",
        },
        {
            reportName: "monthly",
            label: "30 Days",
        },
    ];

    const labelActions: LabelActionProps[] = [
        {
            label: "Confirmed",
            short: "confirmed",
            visible: showConfirmed,
            callback: setShowConfirmed,
        },
        {
            label: "Deaths",
            short: "deaths",
            visible: showDeaths,
            callback: setShowDeaths,
        },
        {
            label: "Active",
            short: "active",
            visible: showActive,
            callback: setShowActive,
        },
    ];
    return (
        <>
            <div ref={ref} className={"card"}>
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
                    <TimeSpan timeSpans={timeSpans} currentRange={currentRange} callback={setCurrentRange} />
                    {standalone && (
                        <>
                            <MovingAvg store={store} />
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
                            showActive={showActive}
                            report={dataStore}
                            stacked={false}
                            type={chartType}
                            label={currentRange === "monthly" || currentRange === "trimonthly" ? "Daily" : "Weekly"}
                        />
                    )}

                    {standalone && (
                        <>
                            <GraphLabelActions labelActions={labelActions} />
                            <hr />
                        </>
                    )}
                    {standalone && <Share />}
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
                        avg={store.yesterdayMovingAvg}
                    />
                    {standalone && <PeakDates store={store} />}
                    {standalone && (
                        <DoublingDates
                            store={store}
                            incidensCases={store.incidens.confirmed}
                            incidensDeaths={store.incidens.deaths}
                        />
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
                        <DownloadReport element={ref.current} name={reportFixed} /> - coronadata.se
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
