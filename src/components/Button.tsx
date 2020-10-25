import React from "react";
import styles from "./styles/Button.module.scss";

interface ButtonProps {
    children: any;
    onClick: () => void;
}

export const Button = ({ children, onClick }: ButtonProps) => (
    <div
        onClick={(event) => {
            event.preventDefault();
            onClick();
        }}
        className={styles.button}>
        {children}
    </div>
);
