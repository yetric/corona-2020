export const debounce = (func, wait, immediate) => {
    let timeout;
    return function() {
        const context = this,
            args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export const relativeToPercentage = (number, toString = true, addPrefix = false) => {
    let percentage = number * 100;
    let prefix = percentage > 0 ? "+" : "";
    let result = Math.round(percentage * 100) / 100 + (toString ? "%" : 0);
    return addPrefix && toString ? prefix + result : result;
};
