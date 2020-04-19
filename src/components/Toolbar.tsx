import React from "react";
import { Link } from "react-router-dom";

export interface ToolbarItem {
    label: string;
    icon: any;
    link?: string;
    onClick?: () => void;
}

interface ToolbarProps {
    items: ToolbarItem[];
}

export const Toolbar = (props: ToolbarProps) => (
    <div className="toolbar">
        {props.items.map((item: ToolbarItem, index: number) => {
            return item.link ? (
                <div key={`toolbar-item-${index}`}>
                    <Link to={item.link}>
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                </div>
            ) : (
                <div
                    key={`toolbar-item-${index}`}
                    onClick={(event) => {
                        event.preventDefault();
                        item.onClick && item.onClick();
                    }}>
                    {item.icon}
                    <span>{item.label}</span>
                </div>
            );
        })}
    </div>
);
