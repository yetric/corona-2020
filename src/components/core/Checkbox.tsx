import React, { useState } from "react";
import { CheckSquare, Square } from "react-feather";
import styles from "./styles/Checkbox.module.css";

interface CheckboxProps {
    checked: boolean;
    label: string;
    onChange: (val: boolean) => void;
}

export const Checkbox = (props: CheckboxProps) => {
    const [checked, setChecked] = useState(props.checked);

    let className = checked ? styles.control + " " + styles.checked : styles.control;

    return (
        <div
            onClick={(event) => {
                event.preventDefault();
                setChecked(!checked);
                props.onChange(!checked);
            }}
            className={className}>
            <span className={styles.icon}>{checked ? <CheckSquare size={13} /> : <Square size={13} />}</span>
            <span className={styles.label}>{props.label}</span>
        </div>
    );
};
