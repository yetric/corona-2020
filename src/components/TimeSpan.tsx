import React from "react";
import { TimeSpanActionProps } from "../models/Reports";

interface TimeSpanProps {
    timeSpans: TimeSpanActionProps[];
    currentRange: string;
    callback: any;
}

export const TimeSpan = ({ timeSpans, currentRange, callback }: TimeSpanProps) => (
    <ul className={"actions"}>
        {timeSpans.map((timespan: TimeSpanActionProps) => (
            <li>
                <a
                    href={"#" + timespan.reportName}
                    className={currentRange === timespan.reportName ? "selected" : ""}
                    onClick={(event) => {
                        event.preventDefault();
                        callback(timespan.reportName);
                    }}>
                    {timespan.label}
                </a>
            </li>
        ))}
    </ul>
);
