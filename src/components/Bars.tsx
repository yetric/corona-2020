import React, { memo } from "react";
import { Bar } from "react-chartjs-2";
import { TypeCollection } from "../stores/DataStore";
import { colors } from "../core/colors";

type BarChartType = "normal" | "stacked" | string;

interface BarsProps {
    data: TypeCollection[];
    labels: string[];
    type: BarChartType;
}

export const Bars = memo(({ data, labels, type }: BarsProps) => {
    let datasets: any[] = [];
    data.forEach((collection: TypeCollection, index: number) => {
        let last = 0;
        const rows = collection.data.map((count: any) => {
            const change = count - last;
            last = count;
            return change;
        });

        datasets.push({
            label: collection.name,
            data: rows,
            backgroundColor: colors[index],
            borderColor: colors[index],
            datasetKeyProvider: collection.name
        });
    });

    const barData = {
        labels: labels,
        datasets
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    stacked: type === "stacked",
                    display: true,
                    ticks: {
                        autoSkip: true
                    }
                }
            ],
            xAxes: [
                {
                    stacked: type === "stacked",
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
        <div className={"bar-chart-elm"}>
            <Bar data={barData} options={options} />
        </div>
    );
});
