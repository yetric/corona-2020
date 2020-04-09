import React, { memo, useState } from "react";
import { Line } from "react-chartjs-2";
import { ReportInterface } from "../stores/ReportStore";
import { createDataset } from "../core/helpers";
import { blue, green, red } from "../core/colors";
import "./Report.css";
import { Loading } from "./Loading";

export type ChartType = "linear" | "logarithmic";

interface ReportProps {
    report: ReportInterface | null;
    type: string;
}

export const Report = memo(({ report, type }: ReportProps) => {
    const [showConfirmed, setShowConfirmed] = useState(true);
    const [showDeaths, setShowDeaths] = useState(true);
    const [showRecovered, setShowRecovered] = useState(true);
    const isLogarithmic = type === "logarithmic";
    if (!report) {
        return (
            <div className={"report-view"}>
                <Loading />
            </div>
        );
    }
    const empty: any[] = [];
    const data = {
        labels: report.labels,
        datasets: empty
    };

    let confirmed = createDataset({
        label: "Confirmed",
        color: blue,
        data: report.confirmed
    });

    let deaths = createDataset({
        label: "Deaths",
        color: red,
        data: report.deaths
    });
    let recovered = createDataset({
        label: "Recovered",
        color: green,
        data: report.recovered
    });

    showConfirmed && data.datasets.push(confirmed);
    showDeaths && data.datasets.push(deaths);
    showRecovered && data.datasets.push(recovered);

    const options = {
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    display: false,
                    type: type,
                    gridLines: false,
                    ticks: {
                        autoSkip: !isLogarithmic,
                        callback: isLogarithmic
                            ? (value: any, index: any, values: any) => {
                                  return index % 5 === 0 && value % 2 === 0 ? value : "";
                              }
                            : (value: any, index: any, values: any) => {
                                  return value % 1 === 0 ? value : "";
                              }
                    }
                }
            ],
            xAxes: [
                {
                    display: false,
                    ticks: {
                        autoSkip: false,
                        callback: (value: any, index: any, values: any) => {
                            return index % 5 === 0 ? value : "";
                        }
                    },
                    gridLines: {
                        display: false
                    }
                }
            ]
        }
    };
    return (
        <div className={"report-view"}>
            <Line data={data} redraw={true} options={options} />
        </div>
    );
});
