import { DataClient } from "../clients/DataClient";
import { action, computed, makeObservable, observable } from "mobx";
import { expMovingAverage } from "../core/stats";
import { CountryMetadata } from "./DataStore";
import chunk from "lodash/chunk";
import { sum } from "lodash";
import {
    DateSpecifics,
    emptyReport,
    GeoCollection,
    GeoOverview,
    MetadataCacheInterface,
    MOVING_AVG_DAYS_DEFAULT,
    ReportCacheInterface,
    ReportInterface,
} from "../models/Reports";

const reportCache: ReportCacheInterface = {};
const metaCache: MetadataCacheInterface = {};

export class ReportStore {
    private client: DataClient;
    @observable report: ReportInterface | null = null;
    @observable weeklyReport: ReportInterface | null = null;
    @observable metadata: CountryMetadata | null = null;
    @observable collection: GeoCollection | null = null;
    @observable movingAvg: boolean = true;
    @observable movingAvgSpan: number = MOVING_AVG_DAYS_DEFAULT;

    constructor() {
        makeObservable(this);
        this.client = new DataClient(process.env.REACT_APP_BASE_URL);
    }

    @action
    async loadReport(name: any, loadMetadata: boolean = false) {
        if (reportCache.hasOwnProperty(name)) {
            this.report = reportCache[name];
        } else {
            const response = await this.client.getJSON("/reports/" + encodeURIComponent(name));
            this.report = response.data;
            reportCache[name] = response.data;
        }

        if (loadMetadata) {
            await this.loadMetadata(name);
        }
        this.dataToWeeks();
    }

    sliceReport(slice: number) {
        if (!this.report) return emptyReport;

        let recoveredBase = this.report?.recovered || [];
        let deathsBase = this.report?.deaths || [];
        let confirmedBase = this.report?.confirmed || [];

        if (this.movingAvg) {
            recoveredBase = expMovingAverage(recoveredBase, this.movingAvgSpan);
            deathsBase = expMovingAverage(deathsBase, this.movingAvgSpan);
            confirmedBase = expMovingAverage(confirmedBase, this.movingAvgSpan);
        }

        console.log(slice < -90);

        if (slice < -92) {
            return {
                recovered: this.toWeek(recoveredBase.slice(slice)),
                deaths: this.toWeek(deathsBase.slice(slice)),
                confirmed: this.toWeek(confirmedBase.slice(slice)),
                labels: this.daysToWeekLabels(this.report?.labels.slice(slice) || []),
                name: this.report?.name || "",
                country: this.report.country || {
                    coord: null,
                    geometry: null,
                    population: null,
                },
            };
        }

        return {
            recovered: recoveredBase.slice(slice),
            deaths: deathsBase.slice(slice),
            confirmed: confirmedBase.slice(slice),
            labels: this.report?.labels.slice(slice) || [],
            name: this.report?.name || "",
            country: this.report.country || {
                coord: null,
                geometry: null,
                population: null,
            },
        };
    }

    flattenReport() {
        let report = this.firstDeathReport();
        return {
            recovered: expMovingAverage(report.recovered, this.movingAvgSpan),
            deaths: expMovingAverage(report.deaths, this.movingAvgSpan),
            confirmed: expMovingAverage(report.confirmed, this.movingAvgSpan),
            labels: report.labels,
            name: report.name,
            country: report.country || {
                coord: null,
                geometry: null,
                population: null,
            },
        };
    }

    @computed get daysSinceFirstDeath(): number {
        if (!this.report) return 0;
        return this.report?.deaths.length - this.daysToFirstDeath();
    }

    @computed get weekly(): ReportInterface {
        return this.sliceReport(-8);
    }

    @computed get biweekly(): ReportInterface {
        return this.sliceReport(-15);
    }

    @computed get monthly(): ReportInterface {
        return this.sliceReport(-31);
    }

    @computed get trimonthly(): ReportInterface {
        return this.sliceReport(-91);
    }

    @computed get halfyear(): ReportInterface {
        return this.sliceReport(-181);
    }

    @computed get yearly(): ReportInterface {
        return this.sliceReport(-365);
    }

    @computed get flatten(): ReportInterface {
        return this.flattenReport();
    }

    @computed get today() {
        let deaths = this.report ? this.report.deaths[this.report.deaths.length - 1] : 0;
        let confirmed = this.report ? this.report.confirmed[this.report.confirmed.length - 1] : 0;
        let recovered = this.report ? this.report.recovered[this.report.recovered.length - 1] : 0;
        let active = confirmed - (deaths + recovered);
        return {
            deaths,
            confirmed,
            recovered,
            active,
        };
    }

    @computed get incidens() {
        let incidensCases = null;
        let incidensDeaths = null;
        if (this.report && this.report.country && this.report.country.population) {
            incidensDeaths = Math.round(this.today.deaths / (this.report.country.population / 100000)).toLocaleString(
                "sv-se"
            );
            incidensCases = Math.round(this.today.confirmed / (this.report.country.population / 100000)).toLocaleString(
                "sv-se"
            );
        }
        return {
            deaths: incidensDeaths,
            confirmed: incidensCases,
        };
    }

    @computed get yesterday() {
        let deathsBefore =
            this.report && this.report.deaths.length > 2 ? this.report.deaths[this.report.deaths.length - 2] : 0;
        let confirmedBefore =
            this.report && this.report.confirmed.length > 2
                ? this.report.confirmed[this.report.confirmed.length - 2]
                : 0;
        let recoveredBefore =
            this.report && this.report.recovered.length > 2
                ? this.report.recovered[this.report.recovered.length - 2]
                : 0;
        let activeBefore = confirmedBefore - (deathsBefore + recoveredBefore);
        return {
            deathsBefore,
            confirmedBefore,
            recoveredBefore,
            activeBefore,
        };
    }

    @computed get changes() {
        let today = this.today;
        let yesterday = this.yesterday;
        return {
            confirmed: today.confirmed - yesterday.confirmedBefore,
            deaths: today.deaths - yesterday.deathsBefore,
            recovered: today.recovered - yesterday.recoveredBefore,
            active: today.active - yesterday.activeBefore,
        };
    }

    @computed get dailyShareOfTotal() {
        const changes = this.changes;
        const yesterday = this.yesterday;
        const deathsCompare = changes.deaths / yesterday.deathsBefore;
        const confirmedCompare = changes.confirmed / yesterday.confirmedBefore;
        const recoveredCompare = changes.recovered / yesterday.recoveredBefore;
        const activeCompare = changes.active / yesterday.activeBefore;
        return {
            deathsCompare,
            confirmedCompare,
            recoveredCompare,
            activeCompare,
        };
    }

    @computed get rates() {
        let today = this.today;
        let deathRate = today.deaths / today.confirmed;
        let recoveryRate = today.recovered / today.confirmed;
        let activityRate = today.active / today.confirmed;
        return {
            deathRate,
            recoveryRate,
            activityRate,
        };
    }

    public daysToFirstDeath(): number {
        if (!this.report) return 0;
        for (let i = 0; i < this.report.deaths.length; i++) {
            if (this.report.deaths[i] > 0) {
                return i;
            }
        }
        return 0;
    }

    private firstDeathReport(): ReportInterface {
        if (!this.report) return emptyReport;

        let deathIndex = this.daysToFirstDeath();

        let recoveredBase = this.movingAvg
            ? expMovingAverage(this.report.recovered, this.movingAvgSpan)
            : this.report.recovered;
        let confirmedBase = this.movingAvg
            ? expMovingAverage(this.report.confirmed, this.movingAvgSpan)
            : this.report.confirmed;
        let deathBase = this.movingAvg ? expMovingAverage(this.report.deaths, this.movingAvgSpan) : this.report.deaths;

        let recovered = [...recoveredBase].splice(deathIndex);
        let deaths = [...deathBase].splice(deathIndex);
        let confirmed = [...confirmedBase].splice(deathIndex);
        let labels = [...this.report.labels].splice(deathIndex);
        return {
            recovered,
            deaths,
            confirmed,
            labels,
            name: this.report.name,
            country: this.report.country || {
                coord: null,
                geometry: null,
                population: null,
            },
        };
    }

    @computed get toWeekly() {
        return [];
    }

    @computed get firstDeath(): ReportInterface {
        return this.firstDeathReport();
    }

    @computed get peakConfirmed(): DateSpecifics | null {
        let confirmedDaily = this.toDaily(this.report?.confirmed);
        const indexOfMaxValue = confirmedDaily.indexOf(Math.max(...confirmedDaily));
        return this.report
            ? {
                  count: Math.max(...confirmedDaily),
                  date: this.report.labels[indexOfMaxValue],
              }
            : null;
    }

    @computed get peakDeaths(): DateSpecifics | null {
        let deathsDaily = this.toDaily(this.report?.deaths);
        const indexOfMaxValue = deathsDaily.indexOf(Math.max(...deathsDaily));
        return this.report
            ? {
                  count: Math.max(...deathsDaily),
                  date: this.report.labels[indexOfMaxValue],
              }
            : null;
    }

    @computed get yesterdayMovingAvg() {
        if (!this.report) {
            return {
                confirmed: 0,
                deaths: 0,
            };
        }
        let confirmedAvg = this.toDaily(expMovingAverage(this.report?.confirmed, this.movingAvgSpan));
        let deathsAvg = this.toDaily(expMovingAverage(this.report?.deaths, this.movingAvgSpan));
        return {
            confirmed: Math.round(confirmedAvg[confirmedAvg.length - 1]),
            deaths: Math.round(deathsAvg[deathsAvg.length - 1]),
        };
    }

    private toDaily(collection: number[] | undefined) {
        if (collection) {
            return collection.map((count, index) => {
                return collection[index - 1] ? count - collection[index - 1] : count;
            });
        }
        return [];
    }

    @action
    private async loadMetadata(name: any) {
        if (metaCache.hasOwnProperty(name)) {
            this.metadata = metaCache[name];
        } else {
            let { metadata } = await this.client.getJSON(`/report/${encodeURIComponent(name)}/metadata`);
            this.metadata = metadata;
            metaCache[name] = metadata;
        }
    }

    addRates(geo: any): GeoCollection {
        for (const geoKey in geo) {
            if (geo.hasOwnProperty(geoKey)) {
                let item: GeoOverview = geo[geoKey];
                item.activityRate = item.active / item.confirmed;
                item.recoveryRate = item.recovered / item.confirmed;
                item.deathRate = item.deaths / item.confirmed;
            }
        }
        return geo;
    }

    @action
    async loadContinent(continent: string) {
        let { geos } = await this.client.getJSON("/continent/" + continent);
        this.collection = this.addRates(geos);
        this.sortBy("country");
    }

    @action
    async loadRegion(region: string) {
        let { geos } = await this.client.getJSON("/region/" + region);
        this.collection = this.addRates(geos);
        this.sortBy("country");
    }

    @action
    sortBy(sort: string) {
        if (!this.collection) return;
        const ordered: GeoCollection = {};
        if (sort === "country") {
            Object.keys(this.collection)
                .sort()
                .forEach((key) => {
                    if (this.collection) {
                        ordered[key] = this.collection[key];
                    }
                });
            this.collection = ordered;
        }

        if (
            sort === "deaths" ||
            sort === "confirmed" ||
            sort === "recovered" ||
            sort === "active" ||
            sort === "deathRate" ||
            sort === "recoveryRate" ||
            sort === "activityRate"
        ) {
            let countries = Object.keys(this.collection);
            countries.sort((a: string, b: string) => {
                if (!this.collection) return 0;
                return this.collection[b][sort] - this.collection[a][sort];
            });
            countries.forEach((key) => {
                if (this.collection) {
                    ordered[key] = this.collection[key];
                }
            });
            this.collection = ordered;
        }
    }

    @action
    setUseMovingAvg(movingAvg: boolean) {
        this.movingAvg = movingAvg;
    }

    @action
    setMovingAvgSpan(num: number) {
        this.movingAvgSpan = num;
    }

    toWeek(data: number[]) {
        return chunk(data, 7).map((arr) => {
            return sum(arr);
        });
    }

    daysToWeekLabels(data: any[]) {
        return chunk(data, 7).map((arr, index) => {
            return index.toString();
        });
    }

    @action
    dataToWeeks() {
        if (!this.report) {
            return null;
        }

        this.weeklyReport = {
            labels: this.daysToWeekLabels(this.report.labels),
            confirmed: this.toWeek(this.report.confirmed),
            deaths: this.toWeek(this.report.deaths),
            recovered: this.toWeek(this.report.recovered),
            name: this.report.name,
            country: this.report.country,
        };

        console.log(this.weeklyReport);
    }
}
