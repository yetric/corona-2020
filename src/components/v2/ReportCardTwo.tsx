import React, { useEffect, useState } from "react";
import { Card } from "../core/Card";

interface ReportCardProps {
    report: string;
    store: any;
}

const ReportPlaceHolder = () => <div>PlaceHolder</div>;

export const ReportCardTwo = ({ report, store }: ReportCardProps) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const loadReport = async () => {
        await store.loadReport(report, false);
        setIsLoaded(true);
    };

    useEffect(() => {
        if (!isLoaded) {
            loadReport().catch((e) => {
                console.error(e);
            });
        }
        return () => {
            console.log("unload me");
        };
    }, [report]);
    return (
        <Card header={report} footer={"footer"}>
            {isLoaded && <div>Loaded</div>}
            {!isLoaded && <ReportPlaceHolder />}
        </Card>
    );
};
