import React, { useState } from "react";
import styles from "./core/styles/Numbox.module.css";

interface NumBoxProps {
    value: number;
    label: string;
    enabled: boolean;
    onChange: (val: number) => void;
}

export const NumBox = (props: NumBoxProps) => {
    const min = 1;
    const max = 100;
    const [current, setCurrent] = useState(props.value);
    const actionClass = styles.base + (props.enabled ? "" : " " + styles.disabled);

    const setCurrentValue = (num: number) => {
        setCurrent(num);
        props.onChange(num);
    };

    return (
        <div className={actionClass}>
            <label>{props.label.replace("%d", current.toString())}</label>
            <span className={styles.actions}>
                <a
                    href={"#minus"}
                    onClick={(event) => {
                        event.preventDefault();
                        let next = current - 1;
                        if (next >= min) {
                            setCurrentValue(next);
                        }
                    }}>
                    -
                </a>
                <a
                    onClick={(event) => {
                        event.preventDefault();
                        let next = current + 1;
                        if (next <= max) {
                            setCurrentValue(next);
                        }
                    }}
                    href={"#plus"}>
                    +
                </a>
            </span>
        </div>
    );
};
