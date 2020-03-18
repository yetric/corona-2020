import React from "react";

export const Links = () => (
    <ul className={"list-group"}>
        <li className={"list-header"}>Swedish links</li>
        <li>
            <a target={"_blank"} rel="noopener noreferrer" href={"https://corona.sll.se/"}>
                Behöver jag ringa vården?
                <br />
                Självskattning (Region Stockholm) <span className={"label"}>New</span>
            </a>
        </li>
        <li>
            <a
                target={"_blank"}
                rel="noopener noreferrer"
                href={"https://www.1177.se/sjukdomar--besvar/infektioner/ovanliga-infektioner/covid-19-coronavirus/"}>
                1177
            </a>
        </li>
        <li>
            <a
                target={"_blank"}
                rel="noopener noreferrer"
                href={
                    "https://www.msb.se/sv/aktuellt/pagaende-handelser-och-insatser/msbs-arbete-med-anledning-av-coronaviruset/"
                }>
                Myndigheten för samhällsskydd och beredskap (MSB)
            </a>
        </li>
        <li>
            <a
                target={"_blank"}
                rel="noopener noreferrer"
                href={
                    "https://www.regeringen.se/regeringens-politik/regeringens-arbete-med-anledning-av-nya-coronaviruset/"
                }>
                Regeringen
            </a>
        </li>
        <li>
            <a
                target={"_blank"}
                rel="noopener noreferrer"
                href={"https://www.folkhalsomyndigheten.se/smittskydd-beredskap/utbrott/aktuella-utbrott/covid-19/"}>
                Folkhälsomyndigheten
            </a>
        </li>
    </ul>
);
