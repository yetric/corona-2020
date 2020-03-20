import React from "react";
import { Placeholder } from "./Placeholder";
import { relativeToPercentage } from "../core/functions";

interface CasesListProps {
    confirmed?: number | null;
    deaths?: number | null;
    recovered?: number | null;
    active?: number | null;

    updated?: string | null;
    deathRate?: number | null;
    recoveryRate?: number | null;
    activityRate?: number | null;
}

export const CasesList = (props: CasesListProps) => (
    <dl>
        <dt>Confirmed</dt>
        <dd>
            {(props.confirmed && props.confirmed.toLocaleString("sv-se")) || <Placeholder />}{" "}
            <small>{props.updated || <Placeholder />}</small>
        </dd>
        <dt>Deaths</dt>
        <dd>
            {(props.deaths && props.deaths.toLocaleString("sv-se")) || <Placeholder />}{" "}
            <small>{(props.deathRate && relativeToPercentage(props.deathRate)) || <Placeholder />}</small>
        </dd>
        <dt>Recovered</dt>
        <dd>
            {(props.recovered && props.recovered.toLocaleString("sv-se")) || <Placeholder />}{" "}
            <small>{(props.recoveryRate && relativeToPercentage(props.recoveryRate)) || <Placeholder />}</small>
        </dd>
        <dt>Active</dt>
        <dd>
            {(props.active && props.active.toLocaleString("sv-se")) || <Placeholder />}{" "}
            <small>{(props.activityRate && relativeToPercentage(props.activityRate)) || <Placeholder />}</small>
        </dd>
    </dl>
);
