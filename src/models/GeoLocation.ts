export interface Confirmed {
    count: any;
    date: string;
}

export interface Deaths {
    count: any;
    date: string;
}

export interface Recovered {
    count: any;
    date: string;
}

export interface GeoLocation {
    id: number;
    province: string;
    country: string;
    lat: string;
    lng: string;
    created_at: string;
    updated_at: string;
    country_id: number;
    confirmed: Confirmed;
    deaths: Deaths;
    recovered: Recovered;
}
