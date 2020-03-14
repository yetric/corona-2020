import React from "react";

export const Home = () => <div>

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
    </div>

    <ul className={"list-group"}>
        <li className={"list-header"}>
            Swedish links
        </li>
        <li>
            <a target={"_blank"} rel={"noopener noreferrer"} href={"https://www.1177.se/sjukdomar--besvar/infektioner/ovanliga-infektioner/covid-19-coronavirus/"}>1177</a>
        </li>
        <li>
            <a target={"_blank"} rel={"noopener noreferrer"}  href={"https://www.msb.se/sv/aktuellt/pagaende-handelser-och-insatser/msbs-arbete-med-anledning-av-coronaviruset/"}>Myndigheten för samhällsskydd och beredskap (MSB)</a>
        </li>
        <li>
            <a target={"_blank"} rel={"noopener noreferrer"}  href={"https://www.regeringen.se/regeringens-politik/regeringens-arbete-med-anledning-av-nya-coronaviruset/"}>Regeringen</a>
        </li>
        <li>
            <a target={"_blank"} rel={"noopener noreferrer"}  href={"https://www.folkhalsomyndigheten.se/smittskydd-beredskap/utbrott/aktuella-utbrott/covid-19/"}>Folkhälsomyndigheten</a>
        </li>
    </ul>

    <div className="card">
        <div className="card-header">
            About CoronaData.se
        </div>
        <div className="card-body">
            An attempt to make data on the Covid-19 outbreak a bit more accessible and easy to overview on country levels. Data is based on reports to Johns Hopkins University and are updated daily. CoronaData.se is hosted, built and updated by <a href={"https://yetric.com"}>Yetric AB</a>
        </div>
    </div>
</div>