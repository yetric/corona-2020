import React, { useEffect } from "react";
import { CasesList } from "./CasesList";
import { ContinentStore } from "../stores/ContinentStore";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { DataStore } from "../stores/DataStore";
import { WorldStore } from "../stores/WorldStore";
import { Edit } from "react-feather";
import { ReportStore } from "../stores/ReportStore";
import { Report } from "./Report";
import { AccumulatedGraph } from "./AccumulatedGraph";

const worldReport = new ReportStore();
const europeReport = new ReportStore();
const swedenReport = new ReportStore();

const dataStore = new DataStore();
dataStore.loadCountry(18);
const worldStore = new WorldStore();
const europeStore = new ContinentStore("Europe");
export const GeoOverview = observer(() => {
    useEffect(() => {
        worldReport.loadReport("world");
        europeReport.loadReport("Europe");
        swedenReport.loadReport("Sweden");
    }, []);
    return (
        <div className={"cards"}>
            <div className="card">
                <div className="card-header">World</div>
                <div className="card-body">
                    {worldReport.report && <Report report={worldReport.report} type={"logarithmic"} />}
                    <CasesList
                        confirmed={worldStore.confirmed}
                        confirmedCompare={worldStore.confirmedCompare}
                        deaths={worldStore.deaths}
                        deathsCompare={worldStore.deathsCompared}
                        recovered={worldStore.recovered}
                        recoveredCompare={worldStore.recoveredCompared}
                        active={worldStore.active}
                        activeCompare={worldStore.activeCompared}
                        activityRate={worldStore.activityRate}
                        deathRate={worldStore.deathRate}
                        recoveryRate={worldStore.recoveryRate}
                        updated={worldStore.date}
                    />
                </div>
                <div className="card-footer">Based on data from Johns Hopkins</div>
            </div>

            <div className="card">
                <div className="card-header">
                    Europe
                    <span className={"action"}>
                        <Edit size={16} />
                    </span>
                </div>
                <div className="card-body">
                    {europeReport.report && <Report report={europeReport.report} type={"logarithmic"} />}
                    <CasesList
                        deaths={europeStore.deathTotal}
                        confirmed={europeStore.confirmedTotal}
                        recovered={europeStore.recoveredTotal}
                        active={europeStore.activeTotal}
                        deathRate={europeStore.deathTotal / europeStore.confirmedTotal}
                        recoveryRate={europeStore.recoveredTotal / europeStore.confirmedTotal}
                        activityRate={europeStore.activeTotal / europeStore.confirmedTotal}
                    />
                </div>
                <div className="card-footer">
                    <Link to={"/continent/Europe"}>More about Europe</Link>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    Sweden
                    <span className={"action"}>
                        <Edit size={16} />
                    </span>
                </div>
                <div className="card-body">
                    {swedenReport.report && <Report report={swedenReport.report} type={"logarithmic"} />}
                    <CasesList
                        confirmed={dataStore.data?.confirmed.count}
                        updated={dataStore.data?.confirmed.date}
                        deaths={dataStore.data?.deaths.count}
                        recovered={dataStore.data?.recovered.count}
                        active={dataStore.activeTotal}
                        deathRate={dataStore.deathRateTotal}
                        recoveryRate={dataStore.recoveryRateTotal}
                        activityRate={dataStore.activityRateTotal}
                    />
                </div>
                <div className="card-footer">
                    <Link to={"/18"}>More about Sweden</Link>
                </div>
            </div>
        </div>
    );
});
