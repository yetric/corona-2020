import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { GeoOverview } from "../components/GeoOverview";
import { HorizontalBar } from "react-chartjs-2";
import { IncidensStore } from "../stores/IncidensStore";
import { red, blue, orange } from "../core/colors";

interface HomeProps {
    store: IncidensStore;
}

const Home = observer(({ store }: HomeProps) => {
    useEffect(() => {
        document.title = "Corona (Covid-19) Data 2020 - Graph and Table - CoronaData.se";
    });

    const deaths = {
        labels: store.deathLabels,
        datasets: [
            {
                label: "Deaths (Incidens)",
                backgroundColor: red,
                borderColor: red,
                borderWidth: 0,
                hoverBackgroundColor: red,
                hoverBorderColor: red,
                data: store.deathData
            }
        ]
    };

    const cases = {
        labels: store.confirmedLabels,
        datasets: [
            {
                label: "Confirmed Cases (Incidens)",
                backgroundColor: blue,
                borderColor: blue,
                borderWidth: 0,
                hoverBackgroundColor: blue,
                hoverBorderColor: blue,
                data: store.confirmedhData
            }
        ]
    };

    const doubling = {
        labels: store.doublingLabels,
        datasets: [
            {
                label: "Doubling Speed (Days)",
                backgroundColor: orange,
                borderColor: orange,
                borderWidth: 0,
                hoverBackgroundColor: orange,
                hoverBorderColor: orange,
                data: store.doublingData
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scaleFontColor: "#ffffcc",
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
                        fontColor: "#a2acc0",
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
        <>
            <div className={"cards horizontal-bars"}>
                <div className="card">
                    <div className="card-header">
                        Deaths per 100K <small>Min. population 1M</small>
                    </div>
                    <div className="card-body">
                        <HorizontalBar data={deaths} options={options} />
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        Cases (Confirmed) per 100K <small>Min. population 1M</small>
                    </div>
                    <div className="card-body">
                        <HorizontalBar data={cases} options={options} />
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">Deaths Doubling Speed (days)</div>
                    <div className="card-body">
                        <HorizontalBar data={doubling} options={options} />
                    </div>
                </div>
            </div>
            <GeoOverview />
        </>
    );
});

export default Home;
