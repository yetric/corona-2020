import React from "react";
import styles from "./styles/Card.module.scss";

interface CardProps {
    children: any;
    header?: any;
    footer?: any;
}

export const Card = ({ children, header = null, footer = null }: CardProps) => (
    <div className={styles.base}>
        {header && <div className={styles.header}>{header}</div>}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
    </div>
);
