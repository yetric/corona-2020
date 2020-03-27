import React from "react";
import "./Modal.css";

interface ModalProps {
    show: boolean;
    header: string;
    footer: string;
    children?: any;
}

export const Modal = ({ children, header, footer, show }: ModalProps) => (
    <div className={"modal-wrapper" + (show ? " show" : "")}>
        <div className={"modal"}>
            <div className="modal-header">{header}</div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">{footer}</div>
        </div>
    </div>
);
