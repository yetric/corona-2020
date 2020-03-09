import React from "react";
import { Line } from "react-chartjs-2";
import {ma} from "../core/stats";

export type ChartType = "linear" | "logarithmic";

interface ChartProps {
    labels: any[];
    data: any[];
    name: string;
    type: string;
}

export const Chart = (props: ChartProps) => {
    if (props.labels.length === 0 || props.data.length === 0) {
        return null;
    }
    const chartDataset = {
        labels: props.labels,
        datasets: [
            {
                fill: false,
                lineTension: 0,
                label: props.name,
                data: props.data,
                backgroundColor: "rgb(208, 135, 112)",
                borderColor: "rgb(208, 135, 112)",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgb(208, 135, 112)",
                pointBackgroundColor: "rgb(208, 135, 112)",
                pointBorderWidth: 1,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: "rgb(208, 135, 112)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 1,
                pointRadius: 0,
                pointHitRadius: 10,
                borderWidth: 2
            },
            {
                fill: false,
                lineTension: 0,
                label: "Moving Avg",
                data: ma(props.data, 3),
                backgroundColor: "rgb(115, 115, 115)",
                borderColor: "rgb(115, 115, 115)",
                borderCapStyle: "butt",
                borderDash: [5,10],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgb(115, 115, 115)",
                pointBackgroundColor: "rgb(115, 115, 115)",
                pointBorderWidth: 1,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: "rgb(115, 115, 115)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 1,
                pointRadius: 0,
                pointHitRadius: 10,
                borderWidth: 2
            }
        ]
    };

    const options = {
        legend: {
            display: false
        },
        maintainAspectRatio: false,
        skipXLabels: 2,
        responsive: true,
        scales: {
            yAxes: [
                {
                    display: true,
                    type: props.type,
                    gridLines: false,
                    ticks: {
                        autoSkip : false,
                        callback: (value: any, index: any, values: any) => {
                            return value % 20 === 0 ? value : "";
                        }
                    },
                }
            ],
            xAxes: [
                {
                    display: false,
                    ticks: {
                        autoSkip : true
                    },
                    gridLines : {
                        display : false,
                    }
                }
            ]
        }
    };

    return <div className={"chart-line"}><Line redraw={true} data={chartDataset} options={options} /></div>;
};
