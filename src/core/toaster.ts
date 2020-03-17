type ToastType = "info" | "error" | "success" | "warning";

interface ToasterProps {
    text: string;
    duration?: number;
    type?: ToastType;
}

export const toast = ({ text, duration = 4500, type = "info" }: ToasterProps) => {
    alert(text);
};
