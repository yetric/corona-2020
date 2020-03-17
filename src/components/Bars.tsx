import React, { memo } from "react";
import { Bar } from "react-chartjs-2";
import { TypeCollection } from "../stores/DataStore";

interface BarsProps {
    data: TypeCollection[];
    labels: string[];
}

export const Bars = memo(({ data, labels }: BarsProps) => {
    let colors = ["rgb(94, 129, 172)", "rgb(191, 97, 106)", "rgb(163, 190, 140)"];
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
            borderColor: colors[index]
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
                    display: true,
                    ticks: {
                        autoSkip: true
                    }
                }
            ],
            xAxes: [
                {
                    display: false,
                    ticks: {
                        autoSkip: true
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
