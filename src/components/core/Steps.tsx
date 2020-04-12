import React from "react";
import "./styles/Steps.css";
import { ArrowLeft, ArrowRight } from "react-feather";

interface StepsProps {
    items: any[];
}

export const Steps = ({ items }: StepsProps) => {
    return (
        <div className={"steps"}>
            {items.map((item, index) => {
                return <div className={"step-indicator" + (index === 0 ? " active" : "")}>{item}</div>;
            })}
            <a className={"previous"} href={"#prev"}>
                <ArrowLeft size={16} />
            </a>
            <a className={"next active"} href={"#next"}>
                <ArrowRight size={16} />
            </a>
        </div>
    );
};
