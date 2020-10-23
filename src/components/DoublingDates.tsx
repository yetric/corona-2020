import React from "react";
import { getDoublingSpeed, lastNthDaysShare, toDaily } from "../core/utils";
import { ReportStore } from "../stores/ReportStore";

interface DoublingDatesProps {
    store: ReportStore;
    incidensDeaths: string | null;
    incidensCases: string | null;
}

export const DoublingDates = ({ store, incidensDeaths, incidensCases }: DoublingDatesProps) => (
    <>
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
                        Confirmed:{" "}
                        <span className={"focus"}>{store.report && getDoublingSpeed(store.report.confirmed)} days</span>
                        <br />
                        Deaths:{" "}
                        <span className={"focus"}>{store.report && getDoublingSpeed(store.report.deaths)} days</span>
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
);
