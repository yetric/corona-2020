import React, { useEffect, useRef } from "react";
import "./Share.css";
import { Share2, Copy } from "react-feather";
import Clipboard from "clipboard";
import { trackEvent } from "../core/tracking";
import { toast } from "../core/toaster";

export const Share = () => {
    const button: any | null = useRef(null);
    let newNavigator: any;

    newNavigator = window.navigator;

    useEffect(() => {
        const clipboard = new Clipboard(button.current, {
            text: function(trigger: any) {
                return window.location.href;
            }
        });

        clipboard.on("success", () => {
            trackEvent({
                category: "Share",
                action: "Copy",
                label: window.location.href
            });
            toast({
                text: "Link copied to clipboard",
                duration: 2000
            });
        });
    });

    const onShare = async () => {
        await newNavigator
            .share({
                title: document.title,
                url: window.location.href
            })
            .catch((e: any) => {})
            .then(() => {
                trackEvent({
                    category: "Share",
                    action: "Native",
                    label: window.location.href
                });
                toast({
                    text: "Thanks for sharing",
                    duration: 2000
                });
            });
    };

    const showShare = "share" in newNavigator;

    return (
        <div className={"share-widget"}>
            <ul>
                <li ref={button}>
                    <Copy size={14} /> Copy
                </li>
                {showShare && (
                    <li
                        onClick={(event) => {
                            event.preventDefault();
                            onShare();
                        }}>
                        <Share2 size={14} /> Share
                    </li>
                )}
            </ul>
        </div>
    );
};
