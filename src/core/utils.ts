const _ = require("lodash");

export const toDaily = (collection: number[]) => {
    let last = 0;
    let daily: number[] = [];
    collection.forEach((item) => {
        daily.push(item - last);
        last = item;
    });
    return daily;
};

export const relativeChange = (collection: number[]) => {
    let last = 0;
    return collection.map((item: number) => {
        let change = last > 0 ? (item - last) / last : 0;
        last = item;
        return change;
    });
};

export const dailyGrowth = (collection: number[]) => {
    let daily = toDaily(collection);
    return collection.map((item: number, index: number) => {
        return daily[index] / item;
    });
};

export const groupBy = (collection: number[], days: number) => {
    return _.chunk(collection, days);
};

export const sumUp = (groupedColl: any[]): number[] => {
    return groupedColl.map((group) => _.sum(group));
};

export const weeklySummary = (collection: number[]) => sumUp(groupBy(collection, 7));
export const monthlySummary = (collection: number[]) => sumUp(groupBy(collection, 30));
export const toPercentage = (relative: number, precision: number = 2) => {
    let num = relative * 100;
    let factor = 10 * precision;
    return Math.round(num * factor) / factor;
};

export const relativeToPercentage = (collection: number[], precision: number = 2) => {
    collection.map((item) => toPercentage(item, precision));
};

export const getDoublingSpeed = (collection: number[]) => {
    let half = collection[collection.length - 1] / 2;
    for (let i = collection.length - 1; i >= 0; i--) {
        if (collection[i] <= half) {
            return collection.length - i;
        }
    }
    return "n/a";
};

export const lastNthDaysShare = (daily: number[], nthDays: number) => {
    const lastNthDays = _.takeRight(daily, nthDays);
    const lastNthDaysTotal = _.sum(lastNthDays);
    const allTotal = _.sum(daily);
    return toPercentage(lastNthDaysTotal / allTotal);
};

export const reportUrlToHeader = (reportName: string, separator: string = " / ") => {
    return decodeURIComponent(reportName)
        .split(":")
        .map((item) => {
            return item.charAt(0).toUpperCase() + item.slice(1);
        })
        .join(separator);
};

export const setCookie = (name: string, value: string, exdays: number) => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    const cookieVal = escape(value) + (exdays == null ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = name + "=" + cookieVal;
};

export const getCookie = (name: string) => {
    const cookieString = document.cookie.split(";");
    for (let i = 0; i < cookieString.length; i++) {
        let cookieName = cookieString[i].substr(0, cookieString[i].indexOf("="));
        let cookieValue = cookieString[i].substr(cookieString[i].indexOf("=") + 1);
        cookieName = cookieName.replace(/^\s+|\s+$/g, "");
        if (cookieName === name) {
            return unescape(cookieValue);
        }
    }
};
const showYaxis = [
    100,
    1000,
    5000,
    10000,
    50000,
    100000,
    200000,
    500000,
    1000000,
    2000000,
    3000000,
    4000000,
    5000000,
    10000000,
];
export const fancyValue = (value: number, locale: string = "sv-se") => {
    if (!showYaxis.includes(value)) {
        return "";
    }

    if (value >= 1000000) {
        return (value / 1000000).toLocaleString(locale) + "M";
    }

    if (value >= 1000) {
        return (value / 1000).toLocaleString(locale) + "K";
    }

    return value.toLocaleString(locale);
};
