import React from "react";
import { ReportStore } from "../stores/ReportStore";

interface PeakDatesProps {
    store: ReportStore;
}

export const PeakDates = ({ store }: PeakDatesProps) => (
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
);
