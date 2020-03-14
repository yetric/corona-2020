import React, { useRef } from "react";
import "./Share.css";
import { Share2, Copy } from 'react-feather';
import Clipboard from "clipboard";

export const Share = () => {
    const button:any | null = useRef(null);
    let newNavigator: any;

    newNavigator = window.navigator;

    const onCopy = () => {
        if (button && button.current) {
            const clipboard = new Clipboard(button.current, {
                text: function(trigger: any) {
                    return window.location.href;
                }
            });

            clipboard.on("success", () => {
                alert("Link copied to clipboard"); // TODO Add toaster
            });
        }

    };
    const onShare = async () => {
        await newNavigator.share({
            title: document.title,
            url: window.location.href
        })
            .catch((e: any) => {})
            .then(() => {
                console.log("Share successful");
            });
    };

    const showShare = "share" in newNavigator;

    return <div className={"share-widget"}>
        <ul>
            <li ref={button} onClick={(event) => {
                event.preventDefault();
                onCopy();
            }}><Copy size={14} /> Copy</li>
            {showShare && <li onClick={(event) => {
                event.preventDefault();
                onShare();
            }}><Share2 size={14} /> Share</li>}
        </ul>
    </div>;
};
