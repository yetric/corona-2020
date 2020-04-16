import React, { useEffect } from "react";
import { About as AboutComponent } from "../components/About";
import { Links } from "../components/Links";

const About = () => {
    useEffect(() => {
        document.title = "About CoronaData.se";
    });
    return (
        <div>
            <AboutComponent />
            <Links />
        </div>
    );
};

export default About;
