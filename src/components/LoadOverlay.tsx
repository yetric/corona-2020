import React from "react";

interface LoadOverlayProps {
    loading: boolean;
    text: string;
}

export const LoadOverlay = ({ loading, text }: LoadOverlayProps) => {
    return loading ? (
        <div className="loading-overlay">
            <div>
                <span>{text}</span>
            </div>
        </div>
    ) : null;
};
