type ToastType = "info" | "error" | "success" | "warning";

interface ToasterProps {
    text: string;
    duration?: number;
    type?: ToastType;
}

export const toast = ({ text, duration = 4500, type = "info" }: ToasterProps) => {
    let wrapperId = "toaster-wrapper";
    let toasterWrapper = document.getElementById(wrapperId);
    if (!toasterWrapper) {
        toasterWrapper = document.createElement("div");
        toasterWrapper.id = wrapperId;
        document.body.appendChild(toasterWrapper);
    }
    let toastElm = document.createElement("div");
    toastElm.className = "toast toast-" + type;
    toastElm.innerHTML = text;
    toasterWrapper.appendChild(toastElm);

    setTimeout(() => {
        toastElm.addEventListener("transitionend", (event) => {
            toastElm.remove();
        });
        toastElm.classList.add("hide");
    }, duration);
};
