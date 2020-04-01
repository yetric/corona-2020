import React, { useEffect, useState } from "react";
import { ReportStore } from "../stores/ReportStore";
import { observer } from "mobx-react";
import { Report } from "./Report";
import { CasesList } from "./CasesList";
import { BarReport } from "./BarReport";
import { Toggle } from "./Toggle";

interface ReportCardProps {
    report: string;
    store: ReportStore;
}

export const ReportCard = observer(({ report, store }: ReportCardProps) => {
    useEffect(() => {
        store.loadReport(report);
    }, []);

    const [chart, setChart] = useState("accumulated");

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

    let deathsCompare = (deaths - deathsBefore) / deathsBefore;
    let confirmedCompare = (confirmed - confirmedBefore) / confirmedBefore;
    let recoveredCompare = (recovered - recoveredBefore) / recoveredBefore;
    let activeCompare = (active - activeBefore) / activeBefore;

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

    return (
        <div className="card">
            <div className="card-header">{reportFixed}</div>
            <div className="card-body">
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
                {chart === "accumulated" && <Report report={store.report} type={"logarithmic"} />}
                {chart === "daily" && <BarReport report={store.report} />}
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
                />
            </div>
        </div>
    );
});
