import React from "react";
import { relativeToPercentage } from "../core/functions";
import "./CasesList.css";
import { CaseListItem } from "./CaseListItem";

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

    incidens?: string | null;

    changes?: {
        confirmed: number;
        deaths: number;
        recovered: number;
        active: number;
    } | null;
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
        <>
            <dl className={"case-list"}>
                <CaseListItem
                    change={props.changes?.confirmed}
                    changeRate={confirmedChange}
                    count={props.confirmed}
                    label={"Confirmed"}
                    rate={props.updated}
                />
                <CaseListItem
                    label={"Deaths"}
                    count={props.deaths}
                    rate={props.deathRate}
                    change={props.changes?.deaths}
                    changeRate={deathChange}
                />
                <CaseListItem
                    label={"Recovered"}
                    count={props.recovered}
                    rate={props.recoveryRate}
                    change={props.changes?.recovered}
                    changeRate={recoveredChange}
                />
                <CaseListItem
                    label={"Active"}
                    count={props.active}
                    rate={props.activityRate}
                    change={props.changes?.active}
                    changeRate={activeChange}
                />
            </dl>
        </>
    );
};
