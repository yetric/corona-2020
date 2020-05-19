import React, { memo } from "react";
import { Line } from "react-chartjs-2";
import { ReportInterface } from "../stores/ReportStore";
import { createDataset } from "../core/helpers";
import { blue, green, red, yellow, orange, purple } from "../core/colors";
import "./Report.css";
import { Loading } from "./Loading";
import "chartjs-plugin-annotation";

export type ChartType = "linear" | "logarithmic";

interface ReportProps {
    report: ReportInterface | null;
    type: string;
    showConfirmed: boolean;
    showDeaths: boolean;
    showRecovered: boolean;
    showActive: boolean;
}

export const Report = memo(({ report, type, showConfirmed, showDeaths, showRecovered, showActive }: ReportProps) => {
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

    const activeData = report.confirmed.map((count: number, index: number) => {
        return count - (report.deaths[index] + report.recovered[index]);
    });

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

    let active = createDataset({
        label: "Active",
        color: yellow,
        data: activeData
    });

    showConfirmed && data.datasets.push(confirmed);
    showDeaths && data.datasets.push(deaths);
    showRecovered && data.datasets.push(recovered);
    showActive && data.datasets.push(active);

    const showYaxis = [0, 100, 1000, 10000, 100000, 1000000, 2500000, 5000000, 10000000];

    const options = {
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    display: true,
                    type: type,
                    gridLines: false,
                    ticks: {
                        autoSkip: !isLogarithmic,
                        callback: isLogarithmic
                            ? (value: any, index: any, values: any) => {
                                  return showYaxis.includes(value) ? value.toLocaleString("sv-se") : "";
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
        },
        annotation: {
            annotations: [
                {
                    type: "line",
                    mode: "vertical",
                    scaleID: "x-axis-0",
                    value: "2020-04-20",
                    borderColor: purple,
                    borderWidth: 1,
                    label: {
                        backgroundColor: purple,
                        content: "1 Million",
                        enabled: true
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
