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
