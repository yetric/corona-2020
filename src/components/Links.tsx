import React from "react";

export const Links = () => (
    <ul className={"list-group"}>
        <li className={"list-header"}>Links</li>
        <li>
            <a
                href={
                    "https://docs.google.com/forms/d/e/1FAIpQLSfluefXvUfS336A-0-vWNB_zFNNyR_bLuwQhcWty4Z8f52KTQ/viewform?usp=sf_link"
                }
                target={"_blank"}
                rel="noopener noreferrer">
                Give us feeback and send us ideas/bug-reports <span className={"label"}>New</span>
            </a>
        </li>
        <li className={"list-header"}>Swedish links</li>
        <li>
            <a target={"_blank"} rel="noopener noreferrer" href={"https://corona.sll.se/"}>
                Behöver jag ringa vården? Självskattning (Region Stockholm)
            </a>
        </li>
        <li>
            <a href={"https://www.krisinformation.se/"}>Krisinformation.se</a>
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
        <li className={"list-header"}>International Links</li>
        <li>
            <a
                href={"https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases"}
                target={"_blank"}
                rel="noopener noreferrer">
                European Centre for Disease Prevention and Control
            </a>
        </li>
        <li>
            <a href={"https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports"}>WHO</a>
        </li>
    </ul>
);
