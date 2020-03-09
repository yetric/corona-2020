import React from "react";
import { Bar } from "react-chartjs-2";

interface BarsProps {
    data: number[];
    labels: string[];
}

export const Bars = ({ data, labels }: BarsProps) => {

    let last = 0;
    const rows = data.map((count: any, index: number) => {
        const change = count - last;
        last = count;
        return change;
    });
    const barData = {
        labels: labels,
        datasets: [
            {
                label: "New",
                data: rows,
                backgroundColor: "rgb(208, 135, 112)",
                borderColor: "rgb(208, 135, 112)",
            }]
    }

    const options = {
        responsive: true, maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    display: true,
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
    return (
        <div className={"bar-chart-elm"}>
            <Bar data={barData} options={options} />
        </div>
    );
};
