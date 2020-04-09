import CountUp from "react-countup";
import { Placeholder } from "./Placeholder";
import { relativeToPercentage } from "../core/functions";
import React from "react";
import { isNumber } from "../core/stats";

interface CaseListProps {
    label: string;
    count: number | null | undefined;
    rate: any | null | undefined;
    change: number | null | undefined;
    changeRate: number | null | undefined;
}

const prefixNum = (num: number) => {
    let prefix = num > 0 ? "+" : num === 0 ? "+/-" : "";
    return prefix + num.toLocaleString("sv-se");
};

export const CaseListItem = (props: CaseListProps) => (
    <>
        <dt>{props.label}</dt>
        <dd>
            {(props.count && <CountUp redraw={false} end={props.count} separator={" "} />) || <Placeholder />}{" "}
            <small>
                {(props.rate && isNumber(props.rate) && (
                    <CountUp end={relativeToPercentage(props.rate, false)} decimals={2} suffix={"%"} redraw={false} />
                )) || <Placeholder />}
            </small>
            <div className="daily-change">
                <span className={"yesterday"}>{props.change && prefixNum(props.change)}</span>
                <span className={"compare"}>{props.changeRate}</span>
                <span className="info">Since Yesterday</span>
            </div>
        </dd>
    </>
);
