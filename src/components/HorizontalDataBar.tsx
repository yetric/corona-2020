import React from "react";
import { HorizontalBar } from "react-chartjs-2";

interface HorizontalDataBarProps {
    data: {
        labels: string[];
        datasets: any[];
    };
    name: string;
    descr: string;
}

export const HorizontalDataBar = ({ data, name, descr = "" }: HorizontalDataBarProps) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            yAxes: [
                {
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        fontColor: "#b8c9ed",
                        fontFamily: "IBM Plex Sans",
                        fontSize: 12,
                        lineHeight: 1.2
                    }
                }
            ],
            xAxes: [
                {
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        fontColor: "#a2acc0",
                        fontFamily: "IBM Plex Sans",
                        beginAtZero: true
                    }
                }
            ]
        }
    };
    return (
        <div className="card">
            <div className="card-header">
                {name} <small className={"meta"}>{descr}</small>
            </div>
            <div className="card-body">
                <HorizontalBar data={data} options={options} />
            </div>
        </div>
    );
};
