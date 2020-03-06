import React, {useState, useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import './App.css';
import Papa from "papaparse";
const COUNTRY_IDX = 1;
const DATA_START_IDX = 4;
const confirmedCasesCSV = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";

const Table = (props: any) => {
  if (!props.data.labels) {
    return null;
  }
  let last = 0;
  const rows = props.data.labels.map((label: any, index: number) => {
    const now = props.data.data[index];
    const change = now - last;
    const changeRelative = change / last;
    const total = props.data.data[index];
    if (total === 0) return null;
    last = now;
    return <tr key={index}>
      <td>{label}</td>
      <td>{change}</td>
      <td>{total}</td>
      <td>{(changeRelative > 0 && isFinite(changeRelative)) && Math.round(changeRelative * 100) + "%"}</td>
    </tr>
  });
  return <table>
    <thead>
    <tr>
      <th>Date</th>
      <th>New</th>
      <th>Total</th>
      <th>Change</th>
    </tr>
    </thead>
    <tbody>
    {rows}
    </tbody>
  </table>;
};


function App() {
  const [chartData, setChartData] = useState({});
  const [raw, setRaw] = useState({});
  const getCountry = (dataset: any[], countryName: string) => {
    for (let i = 0; i < dataset.length; i++) {
      const row = dataset[i];
      const country = row[COUNTRY_IDX];
      if (country === countryName) {
        return row.splice(DATA_START_IDX).map((nr: string) => parseInt(nr));
      }
    }
  };

  const getLabels = (dataset: any[]) => {
    return dataset[0].splice(DATA_START_IDX).map((date: string) => {
      return new Date(date).toLocaleDateString('sv-se');
    });
  };

  const loadCases = async () => {
    Papa.parse(confirmedCasesCSV, {
      download: true,
      header: false,
      complete: function(results) {
        const swedenData = getCountry(results.data, "Sweden");
        const labels = getLabels(results.data);
        setRaw({
          data: swedenData,
          labels
        })
        const chartDataset = {
          labels,
          datasets: [
            {
              fill: false,
              lineTension: 0,
              label: "Confirmed Cases Sweden",
              data: swedenData,
              backgroundColor: 'rgb(208, 135, 112)',
              borderColor: 'rgb(208, 135, 112)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgb(208, 135, 112)',
              pointBackgroundColor: 'rgb(208, 135, 112)',
              pointBorderWidth: 1,
              pointHoverRadius: 10,
              pointHoverBackgroundColor: 'rgb(208, 135, 112)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 1,
              pointRadius: 0,
              pointHitRadius: 10,
              borderWidth: 2
            }
          ]
        };
        setChartData(chartDataset);
      }
    });

  };

  useEffect(() => {
    loadCases().then(() => {
      console.log("Cases loaded");
    });
  }, []);

  const options = {
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }],
    }
      };

  return (
    <div className={"chart"}>
      <h2>Data on Corona in Sweden</h2>
      <div className="chart-line">
        <Line data={chartData} options={options} />
      </div>
      <Table data={raw} />
      <p><a href={"https://github.com/CSSEGISandData/COVID-19"}>Data Source</a> - Graph by <a href={"https://yetric.com"}>Yetric AB</a> - Pull Requests Welcome <a href={"https://github.com/yetric/corona-2020"}>here</a></p>

    </div>
  );
}

export default App;
