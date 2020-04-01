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

const getRandomFloat = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

const rndCount = () => getRandomFloat(0.7, 1.3);

export const CasesList = (props: CasesListProps) => (
    <dl>
        <dt>Confirmed</dt>
        <dd>
            {(props.confirmed && <CountUp separator={" "} end={props.confirmed} />) || <Placeholder />}{" "}
            <small>{props.updated || <Placeholder />}</small>
            <span className={"compare"}>
                {props.confirmedCompare && relativeToPercentage(props.confirmedCompare, true, true)}
            </span>
        </dd>

        <dt>Deaths</dt>
        <dd>
            {(props.deaths && <CountUp end={props.deaths} duration={rndCount()} separator={" "} />) || <Placeholder />}{" "}
            <small>
                {(props.deathRate && (
                    <CountUp
                        duration={rndCount()}
                        end={relativeToPercentage(props.deathRate, false)}
                        decimals={2}
                        suffix={"%"}
                    />
                )) || <Placeholder />}
            </small>
            <span className={"compare"}>
                {props.deathsCompare && relativeToPercentage(props.deathsCompare, true, true)}
            </span>
        </dd>
        <dt>Recovered</dt>
        <dd>
            {(props.recovered && <CountUp end={props.recovered} duration={rndCount()} separator={" "} />) || (
                <Placeholder />
            )}{" "}
            <small>
                {(props.recoveryRate && (
                    <CountUp
                        duration={rndCount()}
                        end={relativeToPercentage(props.recoveryRate, false)}
                        decimals={2}
                        suffix={"%"}
                    />
                )) || <Placeholder />}
            </small>
            <span className={"compare"}>
                {props.recoveredCompare && relativeToPercentage(props.recoveredCompare, true, true)}
            </span>
        </dd>
        <dt>Active</dt>
        <dd>
            {(props.active && <CountUp duration={rndCount()} end={props.active} separator={" "} />) || <Placeholder />}{" "}
            <small>
                {(props.activityRate && (
                    <CountUp
                        duration={rndCount()}
                        end={relativeToPercentage(props.activityRate, false)}
                        decimals={2}
                        suffix={"%"}
                    />
                )) || <Placeholder />}
            </small>
            <span className={"compare"}>
                {props.activeCompare && relativeToPercentage(props.activeCompare, true, true)}
            </span>
        </dd>
    </dl>
);
