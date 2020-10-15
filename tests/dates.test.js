import { groupBy, toDaily } from "../src/core/utils";

const { data } = require("./sweden.json");

test("Load JSON file", () => {
    expect(data.name).toBe("Sweden");
    expect(data.labels).toBeInstanceOf(Array);
    expect(data.confirmed).toBeInstanceOf(Array);
    expect(data.deaths).toBeInstanceOf(Array);
    expect(data.recovered).toBeInstanceOf(Array);
    expect(data.country).toBeInstanceOf(Object);
});

const { name, labels, confirmed, deaths, recovered, country } = data;
test("data quality", () => {
    expect(labels.length).toBe(confirmed.length);
    expect(confirmed.length).toBe(deaths.length);
    expect(deaths.length).toBe(recovered.length);
});

const dailyConfirmed = toDaily(confirmed);
const dailyDeaths = toDaily(deaths);
const dailyRecovered = toDaily(recovered);
test("to daily", () => {
    expect(dailyConfirmed.length).toBe(labels.length);
    expect(dailyDeaths.length).toBe(labels.length);
    expect(dailyRecovered.length).toBe(labels.length);
    expect(dailyConfirmed.length).toBe(dailyDeaths.length);
});

const weeklyConfirmed = groupBy(dailyConfirmed, 7);
const monthlyConfirmed = groupBy(dailyConfirmed, 30);
test("group weekly", () => {
    expect(dailyGrowth(confirmed).length).toBe(confirmed.length);
});
