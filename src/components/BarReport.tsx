import { ReportInterface } from "../stores/ReportStore";
import React from "react";
import { Bar } from "react-chartjs-2";
import { createDataset } from "../core/helpers";
import { blue, green, red } from "../core/colors";
import "./BarReport.css";

interface BarReportProps {
    report: ReportInterface | null;
    showConfirmed: boolean;
    showDeaths: boolean;
    showRecovered: boolean;
    stacked?: boolean;
}

export const BarReport = ({ report, showConfirmed, showDeaths, showRecovered, stacked = true }: BarReportProps) => {
    if (!report) {
        return <div>Loading</div>;
    }

    let last = 0;
    let lastDeath = 0;
    let lastRecovered = 0;
    let change = report.confirmed.map((nr, index) => {
        let confirmed = nr - last;
        let deaths = report.deaths[index] - lastDeath;
        let recovered = report.recovered[index] - lastRecovered;
        let changes = {
            confirmed,
            deaths,
            recovered,
            active: confirmed - (recovered + deaths)
        };
        last = nr;
        lastDeath = report.deaths[index];
        lastRecovered = report.recovered[index];
        return changes;
    });

    change.shift();

    let lbls = [...report.labels];
    lbls.shift();
    const empty: any[] = [];
    const data = {
        labels: lbls,
        datasets: empty
    };

    showConfirmed &&
        data.datasets.push(
            createDataset({
                label: "Confirmed",
                color: blue,
                data: change.map((item) => item.confirmed)
            })
        );

    showDeaths &&
        data.datasets.push(
            createDataset({
                label: "Deaths",
                color: red,
                data: change.map((item) => item.deaths)
            })
        );

    showRecovered &&
        data.datasets.push(
            createDataset({
                label: "Recovered",
                color: green,
                data: change.map((item) => item.recovered)
            })
        );

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
                    stacked,
                    ticks: {
                        beginAtZero: true
                    }
                }
            ],
            xAxes: [
                {
                    display: false,
                    stacked,
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
