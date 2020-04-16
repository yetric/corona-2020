import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { GeoOverview } from "../components/GeoOverview";
import { HorizontalBar } from "react-chartjs-2";
import { IncidensStore } from "../stores/IncidensStore";
import { red, blue } from "../core/colors";

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
                borderWidth: 1,
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
                borderWidth: 1,
                hoverBackgroundColor: blue,
                hoverBorderColor: blue,
                data: store.confirmedhData
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        }
    };

    return (
        <>
            <div className="row">
                <div className="col horizontal-bars">
                    <div className="card">
                        <div className="card-header">Deaths per 100K</div>
                        <div className="card-body">
                            <HorizontalBar data={deaths} options={options} />
                        </div>
                    </div>
                </div>
                <div className="col horizontal-bars">
                    <div className="card">
                        <div className="card-header">Cases per 100K</div>
                        <div className="card-body">
                            <HorizontalBar data={cases} options={options} />
                        </div>
                    </div>
                </div>
            </div>
            <GeoOverview />
        </>
    );
});

export default Home;
