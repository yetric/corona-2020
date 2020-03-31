import React, { useState } from "react";
import { SearchStore } from "../stores/SearchStore";
import { useDebouncedCallback } from "use-debounce";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import "./Search.css";
import { trackEvent } from "../core/tracking";

interface SearchProps {
    history: any;
}

const searchStore = new SearchStore();
export const Search = withRouter(
    observer(({ history }: SearchProps) => {
        const [query, setQuery] = useState("");

        const [debouncedCallback] = useDebouncedCallback(
            // function
            (query) => {
                searchStore.search(query);
                trackEvent({
                    category: "Search",
                    action: "Query",
                    label: query
                });
            },
            // delay in ms
            450
        );

        const onChange = (event: any) => {
            event.preventDefault();
            setQuery(event.target.value);
            debouncedCallback(event.target.value);
        };

        const searchCountryResults = searchStore.result.countries.map((geo: any) => (
            <div
                key={geo.id}
                className={"search-result-item"}
                onClick={(event) => {
                    event.preventDefault();
                    searchStore.clear();
                    setQuery("");
                    history.push("/" + geo.id);
                }}>
                {geo.country} {geo.province && "(" + geo.province + ")"}
            </div>
        ));

        const regionSearchResults = searchStore.result.regions.map((geo: any) => {
            return (
                <div
                    className={"search-result-item"}
                    onClick={(event) => {
                        event.preventDefault();
                        searchStore.clear();
                        setQuery("");
                        history.push(`/region/${encodeURIComponent(geo)}`);
                    }}>
                    {geo}
                </div>
            );
        });

        const continentSearchResults = searchStore.result.continents.map((geo: any) => {
            return (
                <div
                    className={"search-result-item"}
                    onClick={(event) => {
                        event.preventDefault();
                        searchStore.clear();
                        setQuery("");
                        history.push(`/continent/${encodeURIComponent(geo)}`);
                    }}>
                    {geo}
                </div>
            );
        });

        return (
            <div className={"search-component"}>
                <input type={"text"} value={query} onChange={onChange} placeholder={"Search for country ..."} />
                {(searchStore.result.countries.length > 0 ||
                    searchStore.result.regions.length > 0 ||
                    searchStore.result.continents.length > 0) && (
                    <div className={"search-results"}>
                        <div className={"search-result-item-header"}>Countries</div>
                        {searchCountryResults}
                        <div className={"search-result-item-header"}>Regions</div>
                        {regionSearchResults}
                        <div className={"search-result-item-header"}>Continents</div>
                        {continentSearchResults}
                    </div>
                )}
            </div>
        );
    })
);
