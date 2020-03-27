import React from "react";
import { useParams } from "react-router-dom";

const Country = () => {
    let { country } = useParams();
    return <div>{country}</div>;
};

export default Country;
