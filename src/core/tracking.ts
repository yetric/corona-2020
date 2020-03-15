interface EventProps {
    category: string;
    action: string;
    label?: string | null;
    value?: number | null;
    props?: any | null;
}

export const trackEvent = ({ category, action, label = null, value = null, props = null }: EventProps) => {
    if ("ga" in window) {
        ga("send", "event", category, action, label, value, props);
    }
};
