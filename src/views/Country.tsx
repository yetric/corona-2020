import React from "react";
import { useParams } from "react-router-dom";
import { Country2Store } from "../stores/Country2Store";
interface CountryProps {
    store: Country2Store;
}
const Country = ({ store }: CountryProps) => {
    let { country } = useParams();
    return <div>{country}</div>;
};

export default Country;
