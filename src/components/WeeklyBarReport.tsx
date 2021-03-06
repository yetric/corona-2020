import React from "react";
import { Bar } from "react-chartjs-2";
import { createDataset } from "../core/helpers";
import { blue, green, red } from "../core/colors";
import "./BarReport.css";
import { ReportInterface } from "../models/Reports";

interface BarReportProps {
    report: ReportInterface | null;
    showConfirmed: boolean;
    showDeaths: boolean;
    showRecovered: boolean;
    showActive: boolean;
    stacked?: boolean;
    type?: string;
}

export const WeeklyBarReport = ({
    report,
    showConfirmed,
    showDeaths,
    showRecovered,
    showActive,
    stacked = true,
    type = "linear",
}: BarReportProps) => {
    if (!report) {
        return <div>Loading</div>;
    }

    const empty: any[] = [];
    const data = {
        labels: report.labels,
        datasets: empty,
    };

    showConfirmed &&
        data.datasets.push(
            createDataset({
                label: "Confirmed",
                color: blue,
                data: report.confirmed,
            })
        );

    showDeaths &&
        data.datasets.push(
            createDataset({
                label: "Deaths",
                color: red,
                data: report.deaths,
            })
        );

    showRecovered &&
        data.datasets.push(
            createDataset({
                label: "Recovered",
                color: green,
                data: report.recovered,
            })
        );

    const showYaxis = [0, 100, 1000, 10000, 100000, 250000, 1000000, 1500000, 5000000, 10000000];
    const isLogarithmic = type === "logarithmic";
    const options = {
        legend: {
            display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    type,
                    display: true,
                    stacked,
                    gridLines: false,
                    ticks: {
                        beginAtZero: false,
                        suggestedMin: 0,
                        min: 0,
                        autoSkip: !isLogarithmic,
                        callback: isLogarithmic
                            ? (value: any, index: any, values: any) => {
                                  return showYaxis.includes(value) ? value.toLocaleString("sv-se") : "";
                              }
                            : (value: any, index: any, values: any) => {
                                  return value % 1 === 0 ? value.toLocaleString("sv-se") : "";
                              },
                    },
                },
            ],
            xAxes: [
                {
                    display: false,
                    stacked,
                    gridLines: {
                        display: false,
                    },
                },
            ],
        },
    };
    return (
        <div className={"bar-report-wrapper"}>
            <Bar data={data} redraw={true} options={options} />
        </div>
    );
};
