import {action, computed, observable} from "mobx";
import Papa from "papaparse";

export const REGION_IDX = 0;
export const COUNTRY_IDX = 1;
export const LAT_IDX = 2;
export const LNG_IDX = 3;
export const DATA_START_IDX = 4;

export const confirmedCasesCSV = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
export const confirmedDeathsCSV = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
export const confirmedRecoveredCSV = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";

export class DataStore {
    @observable cases: any[] = [];
    @observable data: any[] = [];
    @observable headers: any[] = [];
    @observable labels: any[] = [];

    constructor() {
        this.loadConfirmed();
    }

    @action
    loadConfirmed() {
        Papa.parse(confirmedCasesCSV, {
            download: true,
            header: false,
            complete: (results) => {
                this.cases = results.data;
                this.headers = this.cases[0];
                this.labels = this.headers.splice(DATA_START_IDX).map((date: string) => {
                    return new Date(date).toLocaleDateString('sv-se');
                });
                this.loadCountry('Sweden');
            }
        });
    }

    @action
    loadCountry(countryName: string) {
        for (let i = 0; i < this.cases.length; i++) {
            const row = this.cases[i];
            const country = row[COUNTRY_IDX];
            if (country === countryName) {
                this.data = row.splice(DATA_START_IDX).map((nr: string) => parseInt(nr));
                break;
            }
        }
    }
}