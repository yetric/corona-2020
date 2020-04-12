import React, { useEffect, useRef } from "react";
import "./styles/Modal.css";
import { Steps } from "./Steps";

interface ModalProps {
    children: any;
    allowClose?: boolean;
    header?: any;
    footer?: any;
    steps?: any[];
}

export const Modal = ({ children, header, footer, allowClose, steps }: ModalProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const closeModal = () => {
        if (ref.current) {
            ref.current.remove();
        }
    };
    const escEventHandler = (event: KeyboardEvent) => {
        const { key } = event;
        if (key === "Escape" && allowClose) {
            closeModal();
        }
    };
    useEffect(() => {
        document.addEventListener("keydown", escEventHandler);
        return () => {
            console.log("Unmount Modal");
            document.removeEventListener("keydown", escEventHandler);
        };
    }, []);
    return (
        <div ref={ref} className={"modal-wrapper"}>
            <div className={"modal-element"}>
                {header && <div className={"modal-header"}>{header}</div>}
                <div className={"modal-content"}>{children}</div>
                {steps && <Steps items={steps} />}
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
};
