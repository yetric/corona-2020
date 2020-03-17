import { Share } from "./Share";
import React from "react";

export const Advice = () => (
    <div className="card">
        <div className="card-header">Advice</div>
        <div className="card-body">
            <ol className={"numbered"}>
                <li>Stay home if you are sick</li>
                <li>Wash your hands often</li>
                <li>Cough and sneeze in your arm</li>
                <li>Avoid touching your face</li>
                <li>If you use hand sanitizer use 60%+</li>
                <li>Avoid people with symptoms</li>
                <li>Do not visit people in risk groups</li>
                <li>Stay safe</li>
            </ol>
        </div>
        <div className="card-footer">
            <Share />
        </div>
    </div>
);
