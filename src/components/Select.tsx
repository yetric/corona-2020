import React from "react";

interface SelectProps {
    countries: string[];
    onChange: (value: string) => void;
}

export const Select = ({countries, onChange}: SelectProps) => {

    const _onChange = (event: any) => {
        event.preventDefault();
        onChange(event.target.value);
    };

    return <div>
        <select onChange={_onChange}>
            {countries.map((country: string) => {
                return <option key={country} value={country}>{country}</option>
            })}
        </select>
    </div>
}