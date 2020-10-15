import React, { useState } from "react";
import { SearchStore } from "../stores/SearchStore";
import { useDebouncedCallback } from "use-debounce";
import { observer } from "mobx-react";
import "./Search.css";
import { trackEvent } from "../core/tracking";
import { useHistory } from "react-router-dom";
import { XCircle, Search as SearchIcon } from "react-feather";

interface SearchProps {
    onClose?: () => void;
    show: boolean;
}

const searchStore = new SearchStore();
export const Search = observer(({ onClose = () => {}, show = false }: SearchProps) => {
    const [query, setQuery] = useState("");
    const [isFocus, setIsFocus] = useState(false);
    let history = useHistory();

    const debouncedCallback = useDebouncedCallback(
        // function
        (query: string) => {
            searchStore.search(query);
            trackEvent({
                category: "Search",
                action: "Query",
                label: query,
            });
        },
        // delay in ms
        450
    );

    const onChange = (event: any) => {
        event.preventDefault();
        setQuery(event.target.value);
        debouncedCallback.callback(event.target.value);
    };

    const searchCountryResults = searchStore.result.countries.map((geo: any) => (
        <div
            key={geo.id}
            className={"search-result-item"}
            onClick={(event) => {
                event.preventDefault();
                searchStore.clear();
                setQuery("");
                history.push("/report/" + geo.country);
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
                    history.push(`/report/region:${encodeURIComponent(geo)}`);
                    onClose();
                }}>
                {geo} <small>(Region)</small>
            </div>
        );
    });

    const continentSearchResults = searchStore.result.continents.map((geo: any) => {
        return (
            <div
                key={"search-result-item-" + geo.id}
                className={"search-result-item"}
                onClick={(event) => {
                    event.preventDefault();
                    searchStore.clear();
                    setQuery("");
                    history.push(`/report/continent:${encodeURIComponent(geo)}`);
                    onClose();
                }}>
                {geo} <small>(Continent)</small>
            </div>
        );
    });

    return show ? (
        <div className="search-wrapper">
            <div className={"search-component"}>
                <SearchIcon className={"prefix-icon" + (isFocus ? " icon-focus" : "")} size={16} />
                <input
                    autoFocus={true}
                    type={"text"}
                    value={query}
                    onChange={onChange}
                    onFocus={() => {
                        setIsFocus(true);
                    }}
                    onBlur={() => {
                        setIsFocus(false);
                    }}
                    placeholder={"Search for country ..."}
                />
                <a
                    href="#close-search"
                    onClick={(event) => {
                        event.preventDefault();
                        onClose();
                    }}>
                    <XCircle size={16} /> Close
                </a>
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
    ) : null;
});
