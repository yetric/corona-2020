import { ListFavs } from "./ListFavs";
import { favStore } from "../stores/FavStore";
import { PwaPush } from "./PwaPush";
import { appStore } from "../stores/AppStore";
import { Toolbar, ToolbarItem } from "./Toolbar";
import React, { useState } from "react";
import { Search } from "./Search";
import { Home as HomeIcon, Info, Search as SearchIcon, Star } from "react-feather";

export const ContextTools = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [showFavs, setShowFavs] = useState(false);
    const toolbarItems: ToolbarItem[] = [
        {
            icon: <HomeIcon size={16} />,
            label: "Home",
            link: "/"
        },
        {
            icon: <SearchIcon size={16} />,
            label: "Search",
            onClick: () => {
                setShowSearch(true);
            }
        },
        {
            icon: <Star size={16} />,
            label: "Saved",
            onClick: () => {
                setShowFavs(!showFavs);
            }
        },
        {
            icon: <Info size={16} />,
            label: "About",
            link: "/about"
        }
    ];
    return (
        <>
            <Search
                show={showSearch}
                onClose={() => {
                    setShowSearch(false);
                }}
            />
            <ListFavs items={favStore.favorites} show={showFavs} />
            <PwaPush show={appStore.showPwa} />
            <Toolbar items={toolbarItems} />
        </>
    );
};
