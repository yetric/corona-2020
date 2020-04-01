import { ReportInterface } from "../stores/ReportStore";
import React from "react";
import { Bar } from "react-chartjs-2";
import { createDataset } from "../core/helpers";
import { blue, green, red } from "../core/colors";
import "./BarReport.css";

interface BarReportProps {
    report: ReportInterface | null;
}

export const BarReport = ({ report }: BarReportProps) => {
    if (!report) {
        return <div>Loading</div>;
    }
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
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    display: false,
                    stacked: true
                }
            ],
            xAxes: [
                {
                    display: false,
                    stacked: true,
                    gridLines: {
                        display: false
                    }
                }
            ]
        }
    };
    return (
        <div className={"bar-report-wrapper"}>
            <Bar data={data} redraw={true} options={options} />
        </div>
    );
};
