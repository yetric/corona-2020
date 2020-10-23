import domtoimage from "dom-to-image";
import { Download } from "react-feather";
import React from "react";

interface DonwloadReportProps {
    element: any;
    name: string;
}

export const DownloadReport = ({ element, name }: DonwloadReportProps) => (
    <a
        href={"#download"}
        onClick={(event) => {
            event.preventDefault();
            domtoimage
                .toPng(element)
                .then(function (dataUrl) {
                    let link = document.createElement("a");
                    link.download = encodeURIComponent(name.toLowerCase()) + ".png";
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    console.error("oops, something went wrong!", error);
                });
        }}>
        <Download size={14} /> Export as png
    </a>
);
