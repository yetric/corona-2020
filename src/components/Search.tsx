import React, { useState } from "react";
import { SearchStore } from "../stores/SearchStore";
import { useDebouncedCallback } from "use-debounce";
import { observer } from "mobx-react";
import "./Search.css";
import { trackEvent } from "../core/tracking";
import { useHistory } from "react-router-dom";

interface SearchProps {
    onClose?: () => void;
}

const searchStore = new SearchStore();
export const Search = observer(({ onClose = () => {} }: SearchProps) => {
    const [query, setQuery] = useState("");
    let history = useHistory();

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
                onClose();
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
                    onClose();
                }}>
                {geo} <small>(Region)</small>
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
                    onClose();
                }}>
                {geo} <small>(Continent)</small>
            </div>
        );
    });

    return (
        <div className="search-wrapper">
            <div className={"search-component"}>
                <a
                    href="#close-sarch"
                    onClick={(event) => {
                        event.preventDefault();
                        onClose();
                    }}>
                    Close
                </a>
                <input type={"text"} value={query} onChange={onChange} placeholder={"Search for country ..."} />
                {(searchStore.result.countries.length > 0 ||
                    searchStore.result.regions.length > 0 ||
                    searchStore.result.continents.length > 0) && (
                    <div className={"search-results"}>
                        {searchCountryResults}
                        {regionSearchResults}
                        {continentSearchResults}
                    </div>
                )}
            </div>
        </div>
    );
});
