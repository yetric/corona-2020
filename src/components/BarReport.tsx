import { Bar } from "react-chartjs-2";
import { createDataset } from "../core/helpers";
import { blue, green, red, yellow } from "../core/colors";
import "./BarReport.css";
import { ReportInterface } from "../models/Reports";
import styles from "./styles/BarReport.module.scss";
import React from "react";

interface BarReportProps {
    report: ReportInterface | null;
    showConfirmed: boolean;
    showDeaths: boolean;
    showRecovered: boolean;
    showActive: boolean;
    stacked?: boolean;
    type?: string;
    label?: string | null;
}

export const BarReport = ({
    report,
    showConfirmed,
    showDeaths,
    showRecovered,
    showActive,
    stacked = true,
    type = "linear",
    label = null,
}: BarReportProps) => {
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
            active: confirmed - (recovered + deaths),
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
        datasets: empty,
    };

    showConfirmed &&
        data.datasets.push(
            createDataset({
                label: "Confirmed",
                color: blue,
                data: change.map((item) => item.confirmed),
            })
        );

    showDeaths &&
        data.datasets.push(
            createDataset({
                label: "Deaths",
                color: red,
                data: change.map((item) => item.deaths),
            })
        );

    showRecovered &&
        data.datasets.push(
            createDataset({
                label: "Recovered",
                color: green,
                data: change.map((item) => item.recovered),
            })
        );

    showActive &&
        data.datasets.push(
            createDataset({
                label: "Active",
                data: change.map((item) => item.active),
                color: yellow,
            })
        );
    const showYaxis = [0, 100, 1000, 10000, 100000, 1000000, 2500000, 5000000, 10000000];
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
                              }
                            : (value: any, index: any, values: any) => {
                                  if (value >= 1000 && value < 1000000) {
                                      return value / 1000 + "K";
                                  }

                                  if (value >= 1000000) {
                                      return value / 1000000 + "M";
                                  }

                                  return value;
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
        <div className={"bar-report-wrapper " + styles.wrapper}>
            {label && <div className={styles.label}>{label}</div>}
            <Bar data={data} redraw={true} options={options} />
        </div>
    );
};
