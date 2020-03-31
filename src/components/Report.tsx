import React, { memo, useState } from "react";
import { Line } from "react-chartjs-2";
import { ReportInterface } from "../stores/ReportStore";
import { createDataset } from "../core/helpers";
import { blue, green, pink, red } from "../core/colors";
import "./Report.css";

export type ChartType = "linear" | "logarithmic";

interface ReportProps {
    report: ReportInterface;
    type: string;
}

export const Report = memo(({ report, type }: ReportProps) => {
    const isLogarithmic = type === "logarithmic";
    const active = report.confirmed.map((confirmed: number, index: number) => {
        return confirmed - (report.recovered[index] + report.deaths[index]);
    });
    const data = {
        labels: report.labels,
        datasets: [
            createDataset({
                label: "Confirmed",
                color: blue,
                data: report.confirmed
            }),
            createDataset({
                label: "Deaths",
                color: red,
                data: report.deaths
            }),
            createDataset({
                label: "Recovered",
                color: green,
                data: report.recovered
            })
        ]
    };
    const options = {
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
