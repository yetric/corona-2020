import React, { useEffect, useState } from "react";
import { SearchStore } from "../stores/SearchStore";
import { useDebouncedCallback } from "use-debounce";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import "./Search.css";

interface SearchProps {
    history: any;
}

const searchStore = new SearchStore();
export const Search = withRouter(
    observer(({history}: SearchProps) => {
        const [query, setQuery] = useState("");

        const [debouncedCallback] = useDebouncedCallback(
            // function
            (query) => {
                searchStore.search(query);
            },
            // delay in ms
            450
        );

        const onChange = (event: any) => {
            event.preventDefault();
            setQuery(event.target.value);
            debouncedCallback(event.target.value);
        };

        const searchResults = searchStore.result.map((geo: any) => (
            <div
                key={geo.id}
                className={"search-result-item"}
                onClick={(event) => {
                    event.preventDefault();
                    searchStore.clear();
                    setQuery("");
                    history.push('/' + geo.id);
                }}>
                {geo.country} {geo.province && "(" + geo.province + ")"}
            </div>
        ));

        return (
            <div className={"search-component"}>
                <input type={"text"} value={query} onChange={onChange} placeholder={"Search for country ..."} />
                {searchStore.result.length > 0 && <div className={"search-results"}>{searchResults}</div>}
            </div>
        );
    })
);
