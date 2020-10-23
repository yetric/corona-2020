import React from "react";
import { CheckSquare, Square } from "react-feather";
import { LabelActionProps } from "../models/Reports";

interface GraphLabelActionsProps {
    labelActions: LabelActionProps[];
}

export const GraphLabelActions = ({ labelActions }: GraphLabelActionsProps) => (
    <ul className={"actions"}>
        {labelActions.map((action: LabelActionProps) => (
            <li>
                <a
                    className={`${action.short} ${action.visible ? " selected" : ""}`}
                    href={`#${action.short}`}
                    onClick={(event) => {
                        event.preventDefault();
                        action.callback(!action.visible);
                    }}>
                    {action.visible ? <CheckSquare size={14} /> : <Square size={14} />} {action.label}
                </a>
            </li>
        ))}
    </ul>
);
