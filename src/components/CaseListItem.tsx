import CountUp from "react-countup";
import { Placeholder } from "./Placeholder";
import { relativeToPercentage } from "../core/functions";
import React from "react";
import { isNumber } from "../core/stats";
import { ArrowDownRight, ArrowUpRight } from "react-feather";
import { green, red } from "../core/colors";

interface CaseListProps {
    label: string;
    count: number | null | undefined;
    rate: any | null | undefined;
    change?: number | null | undefined;
    changeRate?: number | null | undefined;
    standalone: boolean;
    avg?: number;
}

const prefixNum = (num: number) => {
    let prefix = num > 0 ? "+" : num === 0 ? "+/-" : "";
    return prefix + num.toLocaleString("sv-se");
};

interface TrendProps {
    change: number;
}

const Trend = ({ change }: TrendProps) => {
    if (change > 0) {
        return <ArrowUpRight size={14} color={red} />;
    } else if (change < 0) {
        return <ArrowDownRight size={14} color={green} />;
    }
    return null;
};

export const CaseListItem = (props: CaseListProps) => {
    let change = null;
    if (props.change && props.avg) {
        change = <Trend change={props.change - props.avg} />;
    }

    return (
        <>
            <dt>{props.label}</dt>
            <dd>
                {(props.count && <CountUp redraw={false} end={props.count} separator={" "} />) || <Placeholder />}{" "}
                <small>
                    {(props.rate && isNumber(props.rate) && (
                        <CountUp
                            end={relativeToPercentage(props.rate, false)}
                            decimals={2}
                            suffix={"%"}
                            redraw={false}
                        />
                    )) || <Placeholder />}
                </small>
                <div className="daily-change">
                    <span className={"yesterday"}>
                        {props.change && (props.change > 0 || props.change < 0) && prefixNum(props.change)} {change}
                    </span>
                </div>
            </dd>
        </>
    );
};
