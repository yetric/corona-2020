import { CountryMetadata } from "../stores/DataStore";

export interface CountryMetaDataInterface {
    population?: number;
    coord?: any;
    geometry?: any;
}

export interface ReportInterface {
    name: string;
    labels: string[];
    confirmed: number[];
    deaths: number[];
    recovered: number[];
    country: CountryMetaDataInterface;
}

export interface DateSpecifics {
    date: string;
    count: number;
}

export interface GeoOverview {
    active: number;
    confirmed: number;
    deaths: number;
    recovered: number;
    deathRate: number;
    recoveryRate: number;
    activityRate: number;
}

export interface GeoCollection {
    [name: string]: GeoOverview;
}

export interface ReportCacheInterface {
    [key: string]: ReportInterface;
}

export interface MetadataCacheInterface {
    [key: string]: CountryMetadata;
}

export enum DateRanges {
    Daily = "daily",
    Weekly = "weekly",
    Monthly = "monthly",
}

export enum DateSpan {
    All = "all",
    Death = "death",
    Halfyear = "6 months",
    Quarterly = "3 months",
    Month = "30 days",
    Halfmonth = "14 days",
}

export const MOVING_AVG_DAYS_DEFAULT = 7;

export const emptyReport = {
    recovered: [],
    deaths: [],
    confirmed: [],
    labels: [],
    name: "",
    country: {
        population: 0,
        geometry: null,
        coord: null,
    },
};

export type DataRange =
    | "all"
    | "yearly"
    | "trimonthly"
    | "monthly"
    | "halfyear"
    | "weekly"
    | "biweekly"
    | "ma"
    | "death";

export interface TimeSpanActionProps {
    reportName: DataRange;
    label: string;
}

export interface LabelActionProps {
    short: string;
    visible: boolean;
    label: string;
    callback: any;
}
