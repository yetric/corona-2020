import React, { useState } from "react";
import { ReportStore } from "../stores/ReportStore";
import { Bar } from "react-chartjs-2";
import { createDataset } from "../core/helpers";
import { blue, orange, purple, red } from "../core/colors";
import { fancyValue } from "../core/utils";

interface TimeSeriesProps {
    store: ReportStore;
    granularity: string;
}

export const TimeSeries = ({ store, granularity }: TimeSeriesProps) => {
    const [graphType, setGraphType] = useState("linear");
    if (!store.weeklyReport || !store.report) {
        return <div>Loading....</div>;
    }

    let isWeekly = granularity === "weekly";
    let labels = isWeekly ? store.weeklyReport.labels : store.report.labels;
    let confirmed = isWeekly ? store.weeklyReport.confirmed : store.report.confirmed;
    let deaths = isWeekly ? store.weeklyReport.deaths : store.report.deaths;

    const data = {
        labels,
        datasets: [createDataset({ label: "Confirmed", data: confirmed, color: blue, options: {} })],
    };
    const isLogarithmic = graphType === "linear";

    const options = {
        legend: {
            display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    type: graphType,
                    display: true,
                    stacked: false,
                    gridLines: false,
                    ticks: {
                        beginAtZero: false,
                        suggestedMin: 0,
                        min: 0,
                        autoSkip: true,
                        callback: (value: any, index: any, values: any) => fancyValue(value),
                    },
                },
            ],
            xAxes: [
                {
                    display: false,
                    stacked: false,
                    gridLines: {
                        display: false,
                    },
                },
            ],
        },
    };
    return (
        <div>
            <Bar data={data} redraw={true} options={options} />
        </div>
    );
};
