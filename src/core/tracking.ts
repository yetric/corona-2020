interface EventProps {
    category: string;
    action: string;
    label?: string | null;
    value?: number | null;
    props?: any | null;
}

interface DimensionProps {
    index: number;
    value: string;
}

export const GaDimension = {
    PLATFORM: 1
};

const g = {
    get is() {
        return "ga" in window;
    },
    send(...args: any[]) {
        let payload = ["send", ...args];
        // @ts-ignore
        this.is && ga(...payload);
    },
    set(...args: any[]) {
        let payload = ["set", ...args];
        // @ts-ignore
        this.is && ga(...payload);
    }
};

export const trackEvent = ({ category, action, label = null, value = null, props = null }: EventProps) =>
    g.send("event", category, action, label, value, props);

export const setDimension = ({ index, value }: DimensionProps) => g.set(`dimension${index}`, value);
