import {action, computed, observable} from "mobx";
import Papa from "papaparse";
import {ma} from "../core/stats";

export const COUNTRY_IDX = 1;
export const DATA_START_IDX = 4;

export const confirmedCasesCSV =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
export const confirmedDeathsCSV =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
export const confirmedRecoveredCSV =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";

export class DataStore {
    @observable cases: any[] = [];
    @observable data: number[] = [];

    @observable headers: string[] = [];
    @observable countries: string[] = [];
    @observable labels: string[] = [];
    @observable renderType: string = "linear";

    @observable selectedCountry: string = "Sweden";

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
                    return new Date(date).toLocaleDateString("sv-se");
                });

                let countriesUnfiltered = this.cases.slice(1).map((row) => {
                    return row[COUNTRY_IDX]
                });
                this.countries = [...new Set(countriesUnfiltered)];

                this.loadCountry(this.selectedCountry);
            }
        });
    }

    @action
    loadCountry(countryName: string) {
        this.selectedCountry = countryName;
        const countryData = [];
        for (let i = 0; i < this.cases.length; i++) {
            const row = this.cases[i];
            const country = row[COUNTRY_IDX];

            if (!this.countries.includes(country)) {
                this.countries.push(country);
            }

            if (country === countryName) {
                countryData.push(row.splice(DATA_START_IDX).map((nr: string) => parseInt(nr)));
            }
        }

        const accumulated: number[] = [];

        countryData.forEach((subData) => {
            subData.forEach((data: number, index: number) => {
                if (accumulated[index]) {
                    accumulated[index] += data;
                } else {
                    accumulated[index] = data;
                }
            });
        });

        this.data = accumulated;
    }

    @action
    setRenderType(renderType: string) {
        this.renderType = renderType;
    }

    @computed get movingAvg() {
        return ma(this.data, 3);
    }

}
