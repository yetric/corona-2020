import ema from "moving-averages/src/ema";
import sma from "moving-averages/src/sma";
import dma from "moving-averages/src/dma";

export const isNumber = (subject) => typeof subject === "number";
export const expMovingAverage = (source, range = 3) => ema(source, range);
export const smoothedMovingAverage = sma;
export const dynMovingAverage = dma;

const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

export function EMACalc(mArray, mRange) {
    const k = 2 / (mRange + 1);
    // first item is just the same as the first item in the input
    let emaArray = [mArray[0]];
    // for the rest of the items, they are computed with the previous one
    for (var i = 1; i < mArray.length; i++) {
        emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k));
    }
    return emaArray;
}
