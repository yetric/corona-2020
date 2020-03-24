import React, { memo } from "react";
import { Line } from "react-chartjs-2";
import { TypeCollection } from "../stores/DataStore";
import { colors } from "../core/colors";

export type ChartType = "linear" | "logarithmic";

interface ChartProps {
    labels: any[];
    data: TypeCollection[];
    name: string;
    type: string;
    colors?: string[];
}

export const Chart = memo((props: ChartProps) => {
    if (props.labels.length === 0 || props.data.length === 0) {
        return null;
    }
    let datasets: any[] = [];
    props.data.forEach((collection: TypeCollection, index: number) => {
        const rows = collection.data.map((count: any) => {
            return count;
        });

        datasets.push({
            fill: false,
            lineTension: 0,
            label: collection.name,
            data: rows,
            backgroundColor: (props.colors && props.colors[index]) || colors[index],
            borderColor: (props.colors && props.colors[index]) || colors[index],
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: (props.colors && props.colors[index]) || colors[index],
            pointBackgroundColor: (props.colors && props.colors[index]) || colors[index],
            pointBorderWidth: 1,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: (props.colors && props.colors[index]) || colors[index],
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 1,
            pointRadius: 0,
            pointHitRadius: 10,
            borderWidth: 2,
            datasetKeyProvider: collection.name
        });
    });
    const chartDataset = {
        labels: props.labels,
        datasets
    };
    const isLogarithmic = props.type === "logarithmic";
    const options = {
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
        <div className={"chart-line"}>
            <Line redraw={true} data={chartDataset} options={options} />
        </div>
    );
});
