import React from "react";
import { Placeholder } from "./Placeholder";
import { relativeToPercentage } from "../core/functions";
import "./CasesList.css";
import CountUp from "react-countup";

interface CasesListProps {
    confirmed?: number | null;
    deaths?: number | null;
    recovered?: number | null;
    active?: number | null;

    updated?: string | null;
    deathRate?: number | null;
    recoveryRate?: number | null;
    activityRate?: number | null;

    confirmedCompare?: number | null;
    deathsCompare?: number | null;
    recoveredCompare?: number | null;
    activeCompare?: number | null;
}

const emptyOrRelative = (num: number | null | undefined) => {
    if (num && !isNaN(num)) {
        return relativeToPercentage(num, true, true);
    }
};

export const CasesList = (props: CasesListProps) => {
    let confirmedChange = emptyOrRelative(props.confirmedCompare);
    let deathChange = emptyOrRelative(props.deathsCompare);
    let recoveredChange = emptyOrRelative(props.recoveredCompare);
    let activeChange = emptyOrRelative(props.activeCompare);

    return (
        <dl>
            <dt>Confirmed</dt>
            <dd>
                {(props.confirmed && <CountUp separator={" "} redraw={false} end={props.confirmed} />) || (
                    <Placeholder />
                )}{" "}
                <small>{props.updated || <Placeholder />}</small>
                <span className={"compare"}>{confirmedChange}</span>
            </dd>

            <dt>Deaths</dt>
            <dd>
                {(props.deaths && <CountUp redraw={false} end={props.deaths} separator={" "} />) || <Placeholder />}{" "}
                <small>
                    {(props.deathRate && (
                        <CountUp
                            end={relativeToPercentage(props.deathRate, false)}
                            decimals={2}
                            suffix={"%"}
                            redraw={false}
                        />
                    )) || <Placeholder />}
                </small>
                <span className={"compare"}>{deathChange}</span>
            </dd>
            <dt>Recovered</dt>
            <dd>
                {(props.recovered && <CountUp redraw={false} end={props.recovered} separator={" "} />) || (
                    <Placeholder />
                )}{" "}
                <small>
                    {(props.recoveryRate && (
                        <CountUp
                            end={relativeToPercentage(props.recoveryRate, false)}
                            decimals={2}
                            suffix={"%"}
                            redraw={false}
                        />
                    )) || <Placeholder />}
                </small>
                <span className={"compare"}>{recoveredChange}</span>
            </dd>
            <dt>Active</dt>
            <dd>
                {(props.active && <CountUp redraw={false} end={props.active} separator={" "} />) || <Placeholder />}{" "}
                <small>
                    {(props.activityRate && (
                        <CountUp
                            end={relativeToPercentage(props.activityRate, false)}
                            decimals={2}
                            suffix={"%"}
                            redraw={false}
                        />
                    )) || <Placeholder />}
                </small>
                <span className={"compare"}>{activeChange}</span>
            </dd>
        </dl>
    );
};
