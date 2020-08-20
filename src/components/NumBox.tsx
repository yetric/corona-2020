import React from "react";

interface NumBoxProps {
    value: number;
    label: string;
}

export const NumBox = (props: NumBoxProps) => <div>{props.label.replace("%d", props.value.toString())}</div>;
