import React from "react";

interface ToggleProp {
    key: string;
    label: string;
}

interface ToggleProps {
    items: ToggleProp[];
    selected: string;
    onSelect: (key: string) => void;
    className?: string;
}
export const Toggle = ({ items, selected, onSelect, className = "" }: ToggleProps) => {
    const toggles = items.map((toggle: ToggleProp) => {
        return (
            <li key={toggle.key} className={toggle.key === selected ? "active" : ""}>
                <a
                    href={"#" + toggle.key}
                    onClick={(event) => {
                        event.preventDefault();
                        onSelect(toggle.key);
                    }}>
                    {toggle.label}
                </a>
            </li>
        );
    });
    return <ul className={"toggle" + (className ? " " + className : "")}>{toggles}</ul>;
};
