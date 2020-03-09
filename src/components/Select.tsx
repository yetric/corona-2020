import React from "react";

interface SelectProps {
    countries: string[];
    onChange: (value: string) => void;
    selected: string;
}

export const Select = ({countries, onChange, selected}: SelectProps) => {

    const _onChange = (event: any) => {
        event.preventDefault();
        onChange(event.target.value);
    };

    return <div>
        <select value={selected} onChange={_onChange}>
            {countries.map((country: string) => {
                return <option key={country} value={country}>{country}</option>
            })}
        </select>
    </div>
}