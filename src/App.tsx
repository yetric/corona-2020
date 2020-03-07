import React from "react";
import { DataStore } from "./stores/DataStore";
import { observer } from "mobx-react";
import { Table } from "./components/Table";
import { Chart } from "./components/Chart";

const dataStore = new DataStore();
const App = observer(() => {
    return (
        <div className={"chart"}>
            <h2>Data on Corona in Sweden</h2>
            <Chart labels={dataStore.labels} data={dataStore.data} name={"Confirmed Cases Sweden"} />
            <Table
                data={{
                    labels: dataStore.labels,
                    data: dataStore.data
                }}
            />
            <p>
                <a href={"https://github.com/CSSEGISandData/COVID-19"}>Data Source</a> - Graph by{" "}
                <a href={"https://yetric.com"}>Yetric AB</a> - Pull Requests Welcome{" "}
                <a href={"https://github.com/yetric/corona-2020"}>here</a>
            </p>
        </div>
    );
});

export default App;
