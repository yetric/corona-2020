import React, { memo } from "react";
import { Line } from "react-chartjs-2";
import { createDataset } from "../core/helpers";
import { blue, green, red, yellow } from "../core/colors";
import "./Report.css";
import { Loading } from "./Loading";
import "chartjs-plugin-annotation";
import { ReportInterface } from "../models/Reports";

export type ChartType = "linear" | "logarithmic";

export interface Annotation {
    date: string;
    label: string;
}

interface ReportProps {
    report: ReportInterface | null;
    type: string;
    showConfirmed: boolean;
    showDeaths: boolean;
    showRecovered: boolean;
    showActive: boolean;
    annotations?: Annotation[];
}

export const Report = memo(
    ({ report, type, showConfirmed, showDeaths, showRecovered, showActive, annotations = [] }: ReportProps) => {
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
            datasets: empty,
        };

        const activeData = report.confirmed.map((count: number, index: number) => {
            return count - (report.deaths[index] + report.recovered[index]);
        });

        let confirmed = createDataset({
            label: "Confirmed",
            color: blue,
            data: report.confirmed,
        });

        let deaths = createDataset({
            label: "Deaths",
            color: red,
            data: report.deaths,
        });
        let recovered = createDataset({
            label: "Recovered",
            color: green,
            data: report.recovered,
        });

        let active = createDataset({
            label: "Active",
            color: yellow,
            data: activeData,
        });

        showConfirmed && data.datasets.push(confirmed);
        showDeaths && data.datasets.push(deaths);
        showRecovered && data.datasets.push(recovered);
        showActive && data.datasets.push(active);

        const showYaxis = [0, 100, 1000, 10000, 100000, 1000000, 2500000, 5000000, 10000000];

        const options: any = {
            legend: {
                display: false,
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
                                      if (!showYaxis.includes(value)) {
                                          return "";
                                      }

                                      if (value >= 1000 && value < 1000000) {
                                          return value / 1000 + "K";
                                      }

                                      if (value >= 1000000) {
                                          return value / 1000000 + "M";
                                      }

                                      return value;
                                      // return showYaxis.includes(value) ? value.toLocaleString("sv-se") : "";
                                  }
                                : (value: any, index: any, values: any) => {
                                      return value % 1 === 0 ? value : "";
                                  },
                        },
                    },
                ],
                xAxes: [
                    {
                        display: false,
                        ticks: {
                            autoSkip: false,
                            callback: (value: any, index: any, values: any) => {
                                return index % 5 === 0 ? value : "";
                            },
                        },
                        gridLines: {
                            display: false,
                        },
                    },
                ],
            },
            annotation: {
                annotations: [],
            },
        };

        // Find  cases

        if (annotations?.length && annotations.length > 0) {
            //options.annotation.annotations = [];
            annotations.forEach((a: Annotation, index: number) => {
                options.annotation.annotations.push({
                    type: "line",
                    mode: "vertical",
                    scaleID: "x-axis-0",
                    value: a.date,
                    borderColor: red,
                    borderWidth: 1,
                    label: {
                        backgroundColor: red,
                        content: a.label,
                        enabled: true,
                        foregroundColor: "#000000",
                        position: "bottom",
                    },
                });
            });
        }

        return (
            <div className={"report-view"}>
                <Line data={data} redraw={true} options={options} />
            </div>
        );
    }
);
